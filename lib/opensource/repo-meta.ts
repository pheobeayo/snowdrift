const GRAPHQL = "https://api.github.com/graphql";

export type RepoMeta = {
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  html_url: string;
  pushed_at: string;
  is_archived: boolean;
};

const CHUNK = 50;

function alias(index: number) {
  return `r${index}`;
}

type GraphQLRepo = {
  nameWithOwner: string;
  description: string | null;
  primaryLanguage: { name: string } | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
  pushedAt: string;
  isArchived: boolean;
} | null;

async function fetchChunk(
  fullNames: string[],
  revalidate: number,
): Promise<RepoMeta[]> {
  const fields = `
    nameWithOwner
    description
    primaryLanguage { name }
    stargazerCount
    forkCount
    url
    pushedAt
    isArchived
  `;

  const query = `query {
    ${fullNames
      .map((fullName, i) => {
        const [owner, name] = fullName.split("/");
        return `${alias(i)}: repository(owner: ${JSON.stringify(
          owner,
        )}, name: ${JSON.stringify(name)}) { ${fields} }`;
      })
      .join("\n")}
  }`;

  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate },
  });

  if (!res.ok) {
    console.error(`[opensource] graphql ${res.status}`);
    return [];
  }

  const json = (await res.json()) as {
    data?: Record<string, GraphQLRepo>;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    console.warn(
      `[opensource] graphql partial: ${json.errors[0].message}` +
        (json.errors.length > 1 ? ` (+${json.errors.length - 1} more)` : ""),
    );
  }

  if (!json.data) return [];

  return Object.values(json.data)
    .filter((r): r is NonNullable<GraphQLRepo> => r !== null)
    .map((r) => ({
      full_name: r.nameWithOwner,
      description: r.description,
      language: r.primaryLanguage?.name ?? null,
      stars: r.stargazerCount,
      forks: r.forkCount,
      html_url: r.url,
      pushed_at: r.pushedAt,
      is_archived: r.isArchived,
    }));
}

export async function fetchRepoMeta(
  fullNames: string[],
  revalidate = 86_400,
): Promise<Map<string, RepoMeta>> {
  const chunks: string[][] = [];
  for (let i = 0; i < fullNames.length; i += CHUNK) {
    chunks.push(fullNames.slice(i, i + CHUNK));
  }

  const results = await Promise.all(
    chunks.map((chunk) => fetchChunk(chunk, revalidate)),
  );

  return new Map(
    results.flat().map((meta) => [meta.full_name.toLowerCase(), meta]),
  );
}

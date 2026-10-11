// Submits every URL from the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver...).
// Run after a deploy is live: `bun indexnow`
// Optionally pass specific URLs: `bun indexnow https://decrypt.im/projects/pokeldn`

const host = "decrypt.im";
const key = "94e6e3a1b329cac58e68c18e2a9e041b";
const keyLocation = `https://${host}/${key}.txt`;

async function getSitemapUrls(): Promise<string[]> {
  const response = await fetch(`https://${host}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

const cliUrls = process.argv.slice(2);
const urlList = cliUrls.length > 0 ? cliUrls : await getSitemapUrls();

const response = await fetch("https://api.indexnow.org/indexnow", {
  body: JSON.stringify({ host, key, keyLocation, urlList }),
  headers: { "Content-Type": "application/json; charset=utf-8" },
  method: "POST",
});

console.log(
  `IndexNow: submitted ${urlList.length} URLs -> ${response.status} ${response.statusText}`
);

if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

export {};

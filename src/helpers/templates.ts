import got from "got";
import promisePipe from "promisepipe";
import tar from "tar";

export function downloadAndExtractTemplate(root: string, name: string): Promise<void> {
  return promisePipe(
    got.stream("https://codeload.github.com/patitonar/create-solidity-project/tar.gz/master"),
    tar.extract({ cwd: root, strip: 3 }, [`create-solidity-project-master/templates/${name}`]),
  );
}

export function hasTemplate(name: string): Promise<boolean> {
  return isUrlOk(
    `https://api.github.com/repos/patitonar/create-solidity-project/contents/templates/${encodeURIComponent(
      name,
    )}/package.json`,
  );
}

export async function isUrlOk(url: string) {
  const res = await got(url).catch(e => e);
  return res.statusCode === 200;
}

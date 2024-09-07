/* eslint-disable @typescript-eslint/no-unused-vars */
import { Yr } from "../components/yr"
import { YrData } from "../../types/yr"
import { Hei } from "../components/hei"
import { Forside } from "../components/forside"
import { notFound } from "next/navigation"
import Trening from "../components/trening"
import { fetchContent } from "@enonic/nextjs-adapter/server";
import "../../lib/component-registry"
import MainView from "@enonic/nextjs-adapter/views/MainView"
import { Slug } from "@/utils/slug"
import { validateData } from "@enonic/nextjs-adapter"

type Params = {
  locale: string;
  contentPath: string | string[]
}


const yrUrl = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.78&lon=10.75"
const enonicAPi = "https://sio-xp7test-master.enonic.cloud/api"

const query = `
      query($path:ID!) {
      guillotine {
        get(key: $path){
          displayName
        }
      }
    }
  `



export default async function Page({ params }: { params: Params }) {
  const { contentPath } = params
  console.log(params)

  if (!contentPath) {
    return <Forside />;
  }
  const pagePath = (contentPath as string[]).join('/')


  const yrData = await fetch(yrUrl)
  const yrJson = await yrData.json() as YrData

  const variables = {
    path: `/sio.no/${pagePath}`
  }

  const body = {
    query,
    variables
  }

  const enonicResponse = await fetch(enonicAPi, {
    method: "POST",
    body: JSON.stringify(body),
  })


  const response = await enonicResponse.json()

  const response2 = await generateStaticProps(params)

  console.log(response2)
  return <MainView {...response2} />

  switch (pagePath) {
    case "yr":
      return <Yr yrData={yrJson} />
    case "hei":
      return <Hei />
    case "trening":
      return <Trening data={response2}/>
    default:
      return notFound()
  }
}

 const homePageSlug = {
  no: "/forside",
  en: "/en/frontpage",
};

const createSlug = (path?: string | string[]): Slug => {
  if (path === undefined) {
    return Slug.from("/");
  }
  if (path === homePageSlug.en) {
    return Slug.from("/en");
  }

  return Slug.from(path);
};

const generateStaticProps = async (params: Params) => {
  const slug = createSlug(params.contentPath);
  console.log("Første")
  const props = await fetchContent(params);

  console.log("Andre")
  validateData(props);

  const { common, data, meta, page } = props;

  if (!data || !meta) {
    return notFound();
  }

  return props
};

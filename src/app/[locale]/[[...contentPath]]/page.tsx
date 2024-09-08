/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Yr } from "../components/yr"
import { YrData } from "../../types/yr"
import { Hei } from "../components/hei"
import { Forside } from "../components/forside"
import { notFound } from "next/navigation"
import Trening from "../components/trening"
import "../../lib/component-registry"
import MainView from "@enonic/nextjs-adapter/views/MainView"
import { Slug } from "@/utils/slug"
import { validateData } from "@enonic/nextjs-adapter"
import { commonQuery, frontPageQuery, salpQuery } from "../../lib/component-registry"

export type Params = {
    locale: string;
    contentPath: string | string[]
}

const sitePath = "sio.no";
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
    const slug = createSlug(params.contentPath);

    const isHomePage = slug.toString() === "/" || !slug;

    const staticProps = await generateStaticProps(params)

    const LayoutComponent = () => (
        <>
            {isHomePage ? (
                <Forside {...staticProps} />
            ) : (
                <Trening {...staticProps} />
            )}

            {/* <ServiceAreaLandingPage {...staticProps} /> */}
            {/* <MainView {...staticProps} /> */}
        </>
    );


    return <LayoutComponent />;
    // return <MainView {...response2} />

    // switch (pagePath) {
    //     case "yr":
    //         return <Yr yrData={yrJson} />
    //     case "hei":
    //         return <Hei />
    //     case "trening":
    //         return <Trening data={response2} />
    //     default:
    //         return notFound()
    // }
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
    let path = createSlug(params.contentPath).toString();
    const slug = createSlug(params.contentPath);

    let dataQuery = salpQuery;

    if (!path || path === "/") {
        path = "/forside";
        dataQuery = frontPageQuery
    }

    const variables = { path: `/sio.no${path}` };

    const layoutQuery = commonQuery
    const layoutResponse = await fetch(enonicAPi, {
        method: "POST",
        body: JSON.stringify({ query: layoutQuery }),
        headers: {
            "X-Guillotine-SiteKey": `/${sitePath}`,
        },
    });

    console.log("variables", variables);
    const layourResponseBody = await layoutResponse.json();

    console.log("layoutResponse", layourResponseBody);

    const body = {
        query: dataQuery,
        variables,
    };

    const response = await fetch("https://sio-xp7test-master.enonic.cloud/api", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "X-Guillotine-SiteKey": `/${sitePath}`,
        },
    });


    const dataResonse = await response.json();
    console.log("dataQueryResponse", dataResonse);

    //   const data = await Promise.all([response.json(), layoutResponse.json()]);

    //   console.log("data", data);
    const pageData = dataResonse.data.guillotine;
    const layoutData = layourResponseBody.data.guillotine.commonSiteData;

    console.log("pageData", pageData);
    console.log("layoutData", layoutData);

    return pageData
};

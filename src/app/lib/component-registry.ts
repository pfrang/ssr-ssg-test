import { ComponentDefinition, ComponentRegistry } from "@enonic/nextjs-adapter";
import "@enonic/nextjs-adapter/baseMappings";
import Trening from "../[locale]/components/trening";
import { Forside } from "../[locale]/components/forside";


export enum EnonicGraphQLField {
    Id = "_id",
    Path = "_path",
    DisplayName = "displayName",
    Type = "type",
    CreatedTime = "createdTime",
    ModifiedTime = "modifiedTime",
    PageUrl = "pageUrl",
    XAsJson = "xAsJson",
    GetMenuItems = "getMenuItems",
    XData = "xData",
    LocalisedPath = "localisedPath",
    Language = "language",
    Seo = "seo",
    Locked = "locked",
    DataASJson = "dataAsJson",
}


const queryFields = [
    EnonicGraphQLField.Type,
    EnonicGraphQLField.DisplayName,
    EnonicGraphQLField.GetMenuItems,
    EnonicGraphQLField.XData,
];

const appKey = "no.sio";

export const ContentType = {
    SERVICE_AREA_LANDING_PAGE: `${appKey}:service-area-landing-page`,
} as const;

export const salpQuery = `
      query($path:ID!) {
        guillotine {
          get(key:$path) {
            ... on no_sio_ServiceAreaLandingPage {
              metaData
              displayName
              createdTime
              modifiedTime
              getSubMenuItems
              data {
                ingress
                extra_submenu_links {
                  displayName
                  pageUrl
                }
              }
            }
          }
        }
      }
    `

export const frontPageQuery = `query {
        guillotine {
          query(
            query: "type='${appKey}:frontpage'"
            sort: "createdTime ASC"
            first: 1
            ) {
            metaData
            ... on no_sio_Frontpage {
              displayName
              createdTime
              modifiedTime
              data {
                banner_small_text
                banner_large_text
                banner_illustration

              }
            }
          }
        }
      }`

export const commonQuery = `
      query {
        guillotine {
          commonSiteData: getSite {
            ${queryFields.join("\n")}
          }
        }
      }`;



ComponentRegistry.setCommonQuery(commonQuery);

const frontPageConfig: ComponentDefinition = {
    view: Forside,
    query: frontPageQuery,
};


export const ContentTypeMapping: Record<string, ComponentDefinition> = {
    FRONTPAGE: frontPageConfig,
    SERVICE_AREA_LANDING_PAGE: {
        view: Trening,
        query: salpQuery,
    },
    SITE: frontPageConfig,
};


Object.keys(ContentTypeMapping).forEach((key) => {
    ComponentRegistry.addContentType(
        ContentType[key as keyof typeof ContentType],
        {
            view: ContentTypeMapping[key as keyof typeof ContentTypeMapping].view,
            query: ContentTypeMapping[key as keyof typeof ContentTypeMapping].query,
        },
    );
});

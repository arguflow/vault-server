import { createEffect, createSignal, For, Show } from "solid-js";
import { CopyButton } from "../../components/CopyButton";
import { FaRegularCircleQuestion } from "solid-icons/fa";
import { JsonInput, MultiStringInput, Select, Tooltip } from "shared/ui";
import { publicPageSearchOptionsSchema } from "../../analytics/utils/schemas/autocomplete";
import { FiExternalLink, FiPlus, FiTrash } from "solid-icons/fi";

import {
  PublicPageProvider,
  usePublicPage,
} from "../../hooks/usePublicPageSettings";
import { HeroPatterns } from "./HeroPatterns";
import { createStore } from "solid-js/store";
import { PublicPageTabMessage } from "trieve-ts-sdk";

export const PublicPageSettingsPage = () => {
  return (
    <div class="rounded border border-neutral-300 bg-white p-4 shadow">
      <div class="flex items-end justify-between pb-2">
        <div>
          <h2 id="user-details-name" class="text-xl font-medium leading-6">
            Demo Page
          </h2>
          <p class="mt-1 text-sm text-neutral-600">
            Expose a demo page to send your share your search to others
          </p>
        </div>
      </div>
      <PublicPageProvider>
        <PublicPageControls />
      </PublicPageProvider>
    </div>
  );
};

const PublicPageControls = () => {
  const {
    extraParams,
    setExtraParams,
    isPublic,
    publishDataset,
    unpublishDataset,
    publicUrl,
    searchOptionsError,
  } = usePublicPage();

  return (
    <>
      <Show when={!isPublic()}>
        <div class="flex items-center space-x-2">
          <button
            onClick={() => {
              void publishDataset();
            }}
            class="inline-flex justify-center rounded-md bg-magenta-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-magenta-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-900"
          >
            Publish Dataset
          </button>
          <Tooltip
            tooltipText="Make a UI to display the search with our component. This is revertable"
            body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
          />
        </div>
      </Show>
      <Show when={isPublic()}>
        <div class="mt-4 flex content-center items-center gap-1.5 gap-x-2.5">
          <span class="font-medium">Published Url:</span>{" "}
          <a class="text-magenta-400" href={publicUrl()} target="_blank">
            {publicUrl()}
          </a>
          <CopyButton size={15} text={publicUrl()} />
          <a
            class="cursor-pointer text-sm text-gray-500 hover:text-magenta-400"
            href={publicUrl()}
            target="_blank"
          >
            <FiExternalLink />
          </a>
        </div>
        <div class="mt-4 flex space-x-3">
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Brand Name
              </label>
              <Tooltip
                tooltipText="Your brand name that will be displayed in the search component"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <input
              placeholder="Trieve"
              value={extraParams.brandName || ""}
              onInput={(e) => {
                setExtraParams("brandName", e.currentTarget.value);
              }}
              class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Color Theme
              </label>
              <Tooltip
                tooltipText="Choose between light and dark mode for the search component"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <Select
              display={(option) =>
                option.replace(/^\w/, (c) => c.toUpperCase())
              }
              onSelected={(option) => {
                setExtraParams("theme", option as "light" | "dark");
              }}
              class="bg-white py-1"
              selected={extraParams.theme || "light"}
              options={["light", "dark"]}
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Brand Color
              </label>
              <Tooltip
                tooltipText="Hex color code for the main accent color in the search component"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <input
              placeholder="#CB53EB"
              value={extraParams.brandColor || ""}
              onInput={(e) => {
                setExtraParams("brandColor", e.currentTarget.value);
              }}
              class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Problem Link
              </label>
              <Tooltip
                tooltipText="Contact link for users to report issues (e.g. mailto: or support URL)"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <input
              placeholder="mailto:humans@trieve.ai"
              value={extraParams.problemLink || ""}
              onInput={(e) => {
                setExtraParams("problemLink", e.currentTarget.value);
              }}
              class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="mt-4 flex items-start gap-8">
          <div class="flex grow flex-col gap-2">
            <div class="flex grow items-center gap-2">
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Heading Prefix
                  </label>
                  <Tooltip
                    tooltipText="Brand name which will be displayed in the navbar on the page"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <div class="flex grow items-center gap-2">
                  <input
                    placeholder="Demo For"
                    value={extraParams.headingPrefix || ""}
                    onInput={(e) => {
                      setExtraParams("headingPrefix", e.currentTarget.value);
                    }}
                    class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Header Brand Name
                  </label>
                  <Tooltip
                    tooltipText="Brand name which will be displayed in the navbar on the page"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <div class="flex grow items-center gap-2">
                  <input
                    placeholder="Devflow, Inc."
                    value={extraParams.forBrandName || ""}
                    onInput={(e) => {
                      setExtraParams("forBrandName", e.currentTarget.value);
                    }}
                    class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Google Font
                  </label>
                  <Tooltip
                    tooltipText="Google font to use for the page. Must be a sans-serif font"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <div class="flex grow items-center gap-2">
                  <input
                    placeholder='"Maven Pro", sans-serif'
                    value={extraParams.brandFontFamily || ""}
                    onInput={(e) => {
                      setExtraParams("brandFontFamily", e.currentTarget.value);
                    }}
                    class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div class="grow">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Creator Name
                </label>
                <Tooltip
                  tooltipText="Your name which will be displayed in the navbar on the page"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <div class="flex grow items-center gap-2">
                <input
                  placeholder="Nick K, CEO"
                  value={extraParams.creatorName || ""}
                  onInput={(e) => {
                    setExtraParams("creatorName", e.currentTarget.value);
                  }}
                  class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div class="grow">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Creator LinkedIn URL
                </label>
                <Tooltip
                  tooltipText="Your LinkedIn URL which will be displayed in the navbar on the page"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <div class="flex grow items-center gap-2">
                <input
                  placeholder="https://www.linkedin.com/in/nicholas-khami-5a0a7a135/"
                  value={extraParams.creatorLinkedInUrl || ""}
                  onInput={(e) => {
                    setExtraParams("creatorLinkedInUrl", e.currentTarget.value);
                  }}
                  class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-start gap-8">
          <div class="flex grow flex-col gap-2">
            <div class="grow">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  In-Module Brand Icon Link
                </label>
                <Tooltip
                  tooltipText="Choose a small icon to be used in the chat module"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <div class="flex grow items-center gap-2">
                <input
                  placeholder="https://cdn.trieve.ai/favicon.ico"
                  value={extraParams.brandLogoImgSrcUrl || ""}
                  onInput={(e) => {
                    setExtraParams("brandLogoImgSrcUrl", e.currentTarget.value);
                  }}
                  class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
                <Show when={extraParams.brandLogoImgSrcUrl}>
                  {(url) => (
                    <div class="max-w-[58px]">
                      <img
                        src={url()}
                        class="max-h-[58px] max-w-[58px]"
                        alt="Brand Logo"
                      />
                    </div>
                  )}
                </Show>
              </div>
            </div>
            <div class="grow">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Brand Navbar Logo Link
                </label>
                <Tooltip
                  tooltipText="URL for your brand's logo that will be displayed in the search component. Square aspect ratio is ideal."
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <div class="flex grow items-center gap-2">
                <input
                  placeholder="https://cdn.trieve.ai/favicon.ico"
                  value={extraParams.navLogoImgSrcUrl || ""}
                  onInput={(e) => {
                    setExtraParams("navLogoImgSrcUrl", e.currentTarget.value);
                  }}
                  class="block w-full grow rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
                <Show when={extraParams.navLogoImgSrcUrl}>
                  {(url) => (
                    <div class="max-w-[58px]">
                      <img
                        src={url()}
                        class="max-h-[58px] max-w-[58px]"
                        alt="Brand Logo"
                      />
                    </div>
                  )}
                </Show>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 items-start gap-2 gap-x-9 pt-4">
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Responsive View
                </label>
                <Tooltip
                  tooltipText="Enable responsive layout for different screen sizes"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.responsive || false}
                type="checkbox"
                onInput={(e) => {
                  setExtraParams("responsive", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Hide Drawn Text
                </label>
                <Tooltip
                  tooltipText="Hide the underline, circles, bracket, and other drawn text"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.hideDrawnText || false}
                type="checkbox"
                onInput={(e) => {
                  setExtraParams("hideDrawnText", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Analytics
                </label>
                <Tooltip
                  tooltipText="Collect analytics for searches on the page"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.analytics || false}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("analytics", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Enable Followup Questions
                </label>
                <Tooltip
                  tooltipText="Show AI powered suggested followup questions after the first message."
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.followupQuestions ?? true}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("followupQuestions", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Enable Suggestions
                </label>
                <Tooltip
                  tooltipText="Show search suggestions as users type"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.suggestedQueries ?? true}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("suggestedQueries", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Enable Chat
                </label>
                <Tooltip
                  tooltipText="Enable RAG Chat in the component"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.chat ?? true}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("chat", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Ecommerce Mode
                </label>
                <Tooltip
                  tooltipText="Use the component in ecommerce mode"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.type === "ecommerce" || false}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams(
                    "type",
                    e.currentTarget.checked ? "ecommerce" : "docs",
                  );
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Use Grouping
                </label>
                <Tooltip
                  tooltipText="Use search over groups instead of chunk-level search"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.useGroupSearch || false}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("useGroupSearch", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Use Localsearch
                </label>
                <Tooltip
                  tooltipText="Localsearch uses pagefind to do search on the client side, must enable pagefind in Dataset Settings"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.usePagefind ?? false}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("usePagefind", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <label class="block" for="">
                  Display Inline
                </label>
                <Tooltip
                  tooltipText="Localsearch uses pagefind to do search on the client side, must enable pagefind in Dataset Settings"
                  body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
                />
              </div>
              <input
                checked={extraParams.inline ?? false}
                type="checkbox"
                onChange={(e) => {
                  setExtraParams("inline", e.currentTarget.checked);
                }}
                class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <SearchOptions />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Default Search Queries
              </label>
              <Tooltip
                tooltipText="Example search queries to show users"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <MultiStringInput
              placeholder={`What is ${
                extraParams["brandName"] || "Trieve"
              }?...`}
              value={extraParams.defaultSearchQueries || []}
              onChange={(e) => {
                setExtraParams("defaultSearchQueries", e);
              }}
              addLabel="Add Example Search"
              addClass="text-sm"
              inputClass="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Default AI Questions
              </label>
              <Tooltip
                tooltipText="Example AI questions to show in the RAG chat"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <MultiStringInput
              placeholder={`What is ${
                extraParams["brandName"] || "Trieve"
              }?...`}
              value={extraParams.defaultAiQuestions || []}
              onChange={(e) => {
                setExtraParams("defaultAiQuestions", e);
              }}
              addLabel="Add Example Question"
              addClass="text-sm"
              inputClass="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Tags
              </label>
              <Tooltip
                tooltipText="Default tag filters for the search component. Each field has a `tag, label, iconClassName` separated by commas. Only tag is required."
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <MultiStringInput
              placeholder={`documentation,docs,fa-solid fa-info`}
              value={
                extraParams.tags?.map((tag) => {
                  return `${tag.tag},${tag.label},${tag.iconClassName}`;
                }) ?? []
              }
              onChange={(e) => {
                setExtraParams(
                  "tags",
                  e.map((tag) => {
                    const [tagStr, label, iconClassName] = tag.split(",");
                    return {
                      tag: tagStr,
                      label,
                      iconClassName,
                    };
                  }),
                );
              }}
              addLabel="Add Tag"
              addClass="text-sm"
              inputClass="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block" for="">
                Button Triggers
              </label>
              <Tooltip
                tooltipText="UI elements that can trigger the search component to open. Each field has a selector and mode (search/chat) separated by commas."
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <MultiStringInput
              placeholder={`#search-icon,search,true`}
              value={
                extraParams.buttonTriggers?.map((trigger) => {
                  return `${trigger.selector},${trigger.mode}`;
                }) ?? []
              }
              onChange={(e) => {
                setExtraParams(
                  "buttonTriggers",
                  e.map((trigger) => {
                    const [selector, mode, replace] = trigger.split(",");
                    if (replace) {
                      return {
                        selector,
                        mode,
                        removeTriggers: replace === "true",
                      };
                    }
                    return {
                      selector,
                      mode,
                      removeTriggers: false,
                    };
                  }),
                );
              }}
              addLabel="Add Trigger"
              addClass="text-sm"
              inputClass="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block">Placeholder Text</label>
              <Tooltip
                tooltipText="Text shown in the search box before user input"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <input
              placeholder="Search..."
              value={extraParams.placeholder || ""}
              onInput={(e) => {
                setExtraParams("placeholder", e.currentTarget.value);
              }}
              class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block">Hero Pattern</label>
              <Tooltip
                tooltipText="Choose a hero pattern for the search component"
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <Select
              display={(option) => option}
              onSelected={(option) => {
                setExtraParams("heroPattern", "heroPatternName", option);
              }}
              class="bg-white py-1"
              selected={extraParams.heroPattern?.heroPatternName || "Solid"}
              options={Object.keys(HeroPatterns)}
            />
          </div>
          <div class="flex flex-row items-center justify-start gap-4 pt-4">
            <div class="">
              <label class="block" for="">
                {extraParams.heroPattern?.heroPatternName === "Solid"
                  ? "Background Color"
                  : "Foreground Color"}
              </label>
              <input
                placeholder="#FFFFFF"
                value={extraParams.heroPattern?.foregroundColor || "#FFFFFF"}
                onInput={(e) => {
                  setExtraParams(
                    "heroPattern",
                    "foregroundColor",
                    e.currentTarget.value,
                  );
                }}
                class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="">
              <Show when={extraParams.heroPattern?.heroPatternName !== "Solid"}>
                <label class="block" for="">
                  Background Color
                </label>
                <input
                  placeholder="#FFFFFF"
                  value={extraParams.heroPattern?.backgroundColor || "#FFFFFF"}
                  onChange={(e) => {
                    setExtraParams(
                      "heroPattern",
                      "backgroundColor",
                      e.currentTarget.value,
                    );
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </Show>
            </div>
            <div class="">
              <Show when={extraParams.heroPattern?.heroPatternName !== "Solid"}>
                <label class="block" for="">
                  Foreground Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  onChange={(e) => {
                    setExtraParams(
                      "heroPattern",
                      "foregroundOpacity",
                      parseInt(e.currentTarget.value) / 100,
                    );
                  }}
                  value={
                    (extraParams.heroPattern?.foregroundOpacity || 0.5) * 100
                  }
                />
              </Show>
            </div>
          </div>
          <div class="grow" />
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block">Video Link</label>
              <Tooltip
                tooltipText="Video that will be displayed on the demo page. Needs to be the embed link."
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <input
              placeholder="Insert video link..."
              value={extraParams.videoLink || ""}
              onInput={(e) => {
                setExtraParams("videoLink", e.currentTarget.value);
                if (!extraParams.videoPosition) {
                  setExtraParams("videoPosition", "static");
                }
              }}
              class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="grow">
            <div class="flex items-center gap-1">
              <label class="block">Video Position</label>
              <Tooltip
                tooltipText="Position of the video on the page. Either floating or product."
                body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
              />
            </div>
            <Select
              display={(option) => option}
              onSelected={(option) => {
                setExtraParams("videoPosition", option);
              }}
              class="bg-white py-1"
              selected={extraParams.videoPosition || "static"}
              options={["static", "floating", "product"]}
            />
          </div>
        </div>
        <details class="pt-4">
          <summary class="cursor-pointer text-sm font-medium">
            Advanced Settings
          </summary>
          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Default Currency
                  </label>
                  <Tooltip
                    tooltipText="Set the default currency for pricing display"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  placeholder="USD"
                  value={extraParams.defaultCurrency || ""}
                  onInput={(e) => {
                    setExtraParams("defaultCurrency", e.currentTarget.value);
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Currency Position
                  </label>
                  <Tooltip
                    tooltipText="Position of currency symbol (prefix/suffix)"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <Select
                  display={(option) => option}
                  onSelected={(option) => {
                    setExtraParams(
                      "currencyPosition",
                      option as "prefix" | "suffix",
                    );
                  }}
                  class="bg-white py-1"
                  selected={extraParams.currencyPosition || "prefix"}
                  options={["prefix", "suffix"]}
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Default Search Mode
                  </label>
                  <Tooltip
                    tooltipText="Set the initial search mode"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <Select
                  display={(option) => option}
                  onSelected={(option) => {
                    setExtraParams("defaultSearchMode", option);
                  }}
                  class="bg-white py-1"
                  selected={extraParams.defaultSearchMode || "search"}
                  options={["search", "chat"]}
                />
              </div>

              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Z Index
                  </label>
                  <Tooltip
                    tooltipText="The z-index of the component modal"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="number"
                  placeholder="1000"
                  value={extraParams.zIndex || 1000}
                  onInput={(e) => {
                    setExtraParams("zIndex", parseInt(e.currentTarget.value));
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Debounce (ms)
                  </label>
                  <Tooltip
                    tooltipText="Delay before search triggers after typing"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="number"
                  placeholder="300"
                  value={extraParams.debounceMs || 300}
                  onInput={(e) => {
                    setExtraParams(
                      "debounceMs",
                      parseInt(e.currentTarget.value),
                    );
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Show Floating Chat Button
                  </label>
                  <Tooltip
                    tooltipText="Show a floating chat button on the page"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.showFloatingButton || false}
                  onChange={(e) => {
                    setExtraParams(
                      "showFloatingButton",
                      e.currentTarget.checked,
                    );
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Floating Chat Button Position
                  </label>
                  <Tooltip
                    tooltipText="Either top-right, bottom-right, top-left, or bottom-left"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  value={extraParams.floatingButtonPosition || "bottom-right"}
                  onChange={(e) => {
                    setExtraParams(
                      "floatingButtonPosition",
                      e.currentTarget.value,
                    );
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Show Floating Search Button
                  </label>
                  <Tooltip
                    tooltipText="Show a floating search button on the page"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.showFloatingSearchIcon || false}
                  onChange={(e) => {
                    setExtraParams(
                      "showFloatingSearchIcon",
                      e.currentTarget.checked,
                    );
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="grow">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Floating Search Button Position
                  </label>
                  <Tooltip
                    tooltipText="Either left or right"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  value={extraParams.floatingSearchIconPosition || "right"}
                  onChange={(e) => {
                    setExtraParams(
                      "floatingSearchIconPosition",
                      e.currentTarget.value,
                    );
                  }}
                  class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Show Floating Search Input
                  </label>
                  <Tooltip
                    tooltipText="Show floating search input on the page"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.showFloatingInput || false}
                  onChange={(e) => {
                    setExtraParams(
                      "showFloatingInput",
                      e.currentTarget.checked,
                    );
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Allow Switching Modes
                  </label>
                  <Tooltip
                    tooltipText="Enable users to switch between search modes"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.allowSwitchingModes || false}
                  onChange={(e) => {
                    setExtraParams(
                      "allowSwitchingModes",
                      e.currentTarget.checked,
                    );
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Use Group Search
                  </label>
                  <Tooltip
                    tooltipText="Enable grouped search results"
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.useGroupSearch || false}
                  onChange={(e) => {
                    setExtraParams("useGroupSearch", e.currentTarget.checked);
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>

              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Use Beta component
                  </label>
                  <Tooltip
                    tooltipText="Use the beta version of the search-component."
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.isTestMode || false}
                  onChange={(e) => {
                    setExtraParams("isTestMode", e.currentTarget.checked);
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex gap-2">
                <div class="flex items-center gap-1">
                  <label class="block" for="">
                    Default open in new tab
                  </label>
                  <Tooltip
                    tooltipText="Enable this to open product pages in a new tab."
                    body={
                      <FaRegularCircleQuestion class="h-3 w-3 text-black" />
                    }
                  />
                </div>
                <input
                  type="checkbox"
                  checked={extraParams.openLinksInNewTab || false}
                  onChange={(e) => {
                    setExtraParams(
                      "openLinksInNewTab",
                      e.currentTarget.checked,
                    );
                  }}
                  class="block w-4 rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </details>

        <OgOptions />

        <SingleProductOptions />

        <TabOptions />

        <div class="space-x-1.5 pt-8">
          <button
            class="inline-flex justify-center rounded-md bg-magenta-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-magenta-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-900 disabled:opacity-40"
            onClick={() => {
              void publishDataset();
            }}
            disabled={searchOptionsError() !== null}
          >
            Save
          </button>
          <button
            class="inline-flex justify-center rounded-md border-2 border-magenta-500 px-3 py-2 text-sm font-semibold text-magenta-500 shadow-sm hover:bg-magenta-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-900"
            onClick={() => {
              void unpublishDataset();
            }}
          >
            Make Private
          </button>
        </div>
      </Show>
    </>
  );
};

export const SingleProductOptions = () => {
  const { extraParams, setExtraParams } = usePublicPage();
  const [defaultDetailOpen] = createSignal(
    !!extraParams.singleProductOptions?.productTrackingId ||
      !!extraParams.singleProductOptions?.groupTrackingId ||
      !!extraParams.singleProductOptions?.productName ||
      !!extraParams.singleProductOptions?.productDescriptionHtml ||
      !!extraParams.singleProductOptions?.productPrimaryImageUrl,
  );

  return (
    <details class="pt-2" open={defaultDetailOpen()}>
      <summary class="cursor-pointer text-sm font-medium">
        Single Product View
      </summary>
      <div class="flex gap-4 pt-2">
        <div class="grow">
          <label class="block">Product Tracking ID</label>
          <input
            placeholder="Tracking ID of the product to display"
            value={extraParams.singleProductOptions?.productTrackingId || ""}
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                productTrackingId: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="grow">
          <label class="block">Product Image URL</label>
          <input
            placeholder="URL of the product image to display"
            value={
              extraParams.singleProductOptions?.productPrimaryImageUrl || ""
            }
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                productPrimaryImageUrl: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="grow">
          <label class="block">Product Name</label>
          <input
            placeholder="Name of the product to display"
            value={extraParams.singleProductOptions?.productName || ""}
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                productName: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div class="flex gap-4 pb-2 pt-2">
        <div class="grow">
          <label class="block">Group Tracking ID</label>
          <input
            placeholder="Tracking ID of the product to display"
            value={extraParams.singleProductOptions?.groupTrackingId || ""}
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                groupTrackingId: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="grow">
          <div class="flex items-center gap-1">
            <label class="block" for="">
              Product Questions
            </label>
            <Tooltip
              tooltipText="Example AI questions which may be asked about the product"
              body={<FaRegularCircleQuestion class="h-3 w-3 text-black" />}
            />
          </div>
          <MultiStringInput
            placeholder="What does it do?..."
            value={extraParams.singleProductOptions?.productQuestions || []}
            onChange={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                productQuestions: e,
              });
            }}
            addLabel="Add Product Question"
            addClass="text-sm"
            inputClass="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div class="flex gap-4 pb-2 pt-2">
        <div class="grow">
          <label class="block">Recommendation Search Query</label>
          <input
            placeholder="Search query to use for recommendations"
            value={extraParams.singleProductOptions?.recSearchQuery || ""}
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                recSearchQuery: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div class="flex gap-4 pb-2 pt-2">
        <div class="grow">
          <label class="block">Product Description HTML</label>
          <textarea
            cols={2}
            placeholder="Description of the page"
            value={
              extraParams.singleProductOptions?.productDescriptionHtml || ""
            }
            onInput={(e) => {
              setExtraParams("singleProductOptions", {
                ...extraParams.singleProductOptions,
                productDescriptionHtml: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </details>
  );
};

export const TabOptions = () => {
  const { extraParams: params } = usePublicPage();

  // We know params.tabMessages is an array because of effect in hook
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [messages, setMessages] = createStore(params.tabMessages!);

  const [selectedTabIndex, setSelectedTabIndex] = createSignal<number | null>(
    null,
  );

  createEffect(() => {
    if (messages.length > 0 && selectedTabIndex() === null) {
      setSelectedTabIndex(0);
    }
  });

  const TabConfig = (props: {
    index: number;
    message: PublicPageTabMessage;
  }) => {
    const [nameRequiredWarning, setNameRequiredWarning] = createSignal(false);
    return (
      <>
        <button
          onClick={() => {
            setMessages([
              ...messages.slice(0, props.index),
              ...messages.slice(props.index + 1),
            ]);
            setSelectedTabIndex(null);
          }}
          class="absolute right-2 top-2 flex items-center gap-2 rounded border border-neutral-200 bg-neutral-100 p-1 text-sm font-medium text-neutral-500 hover:bg-neutral-200"
        >
          <FiTrash />
          Delete Tab
        </button>
        <div class="flex gap-6">
          <div>
            <label class="block">Tab Name</label>
            <input
              onFocusOut={(e) => {
                if (e.currentTarget.value === "") {
                  setNameRequiredWarning(true);
                }
              }}
              placeholder={`Tab ${props.index + 1}`}
              class="block w-full max-w-md rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
              value={props.message.title || ""}
              onInput={(e) => {
                setMessages(props.index, {
                  ...props.message,
                  title: e.currentTarget.value,
                });
              }}
            />
            <Show when={nameRequiredWarning() && props.message.title === ""}>
              <div class="text-sm text-red-500">Tab name is required</div>
            </Show>
          </div>
          <div class="flex items-end gap-2">
            <label>Show Component Code</label>
            <input
              type="checkbox"
              class="-translate-y-1"
              checked={props.message.showComponentCode || false}
              onChange={(e) => {
                setMessages(props.index, {
                  ...props.message,
                  showComponentCode: e.currentTarget.checked,
                });
              }}
            />
          </div>
        </div>
        <label class="block pt-4" for="">
          Message HTML
          <div class="text-xs text-neutral-500">
            This is the HTML that will be displayed on the demo page under that
            tab
          </div>
        </label>
        <HtmlEditor
          value={props.message.tabInnerHtml || ""}
          onValueChange={(value) => {
            setMessages(props.index, {
              ...props.message,
              tabInnerHtml: value,
            });
          }}
        />
      </>
    );
  };

  return (
    <details class="pt-2" open={messages.length > 0}>
      <summary class="cursor-pointer text-sm font-medium">Tab Messages</summary>
      <div class="flex items-end gap-2 overflow-y-auto pt-2">
        <For each={messages}>
          {(message, index) => (
            <div class="flex flex-row gap-2">
              <button
                onClick={() => {
                  setSelectedTabIndex(index);
                }}
                classList={{
                  "bg-neutral-200/70 border-neutral-200 border hover:bg-neutral-200 p-2 px-4 rounded-t-md":
                    true,
                  "!bg-magenta-100/50 border-transparent hover:bg-magenta-100/80 text-magenta-900":
                    index() === selectedTabIndex(),
                }}
              >
                {message.title || `Tab ${index() + 1}`}
              </button>
            </div>
          )}
        </For>
        <button
          onClick={() => {
            setMessages(messages.length, {
              title: "",
              tabInnerHtml: "",
              showComponentCode: false,
            });
            setSelectedTabIndex(messages.length - 1);
          }}
          classList={{
            "ml-4 rounded flex items-center gap-2 border border-neutral-300 hover:bg-neutral-200 py-1 bg-neutral-100 p-2":
              true,
            "border-b-transparent": selectedTabIndex() !== null,
          }}
        >
          <FiPlus />
          Add Tab
        </button>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <Show when={selectedTabIndex() != null && messages[selectedTabIndex()!]}>
        <div class="relative border border-neutral-200 p-4">
          <TabConfig
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            index={selectedTabIndex()!}
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            message={messages[selectedTabIndex()!]}
          />
        </div>
      </Show>
    </details>
  );
};

export const SearchOptions = () => {
  const {
    extraParams,
    setExtraParams,
    searchOptionsError,
    setSearchOptionsError,
  } = usePublicPage();
  return (
    <div class="mt-1">
      <div class="flex items-baseline justify-between">
        <div>Search Options</div>
        <a
          href="https://ts-sdk.trieve.ai/types/types_gen.SearchChunksReqPayload.html"
          target="_blank"
          class="text-sm opacity-65"
        >
          View Schema
        </a>
      </div>
      <JsonInput
        theme="light"
        onValueChange={(value) => {
          const result = publicPageSearchOptionsSchema.safeParse(value);

          if (result.success) {
            setExtraParams("searchOptions", result.data);
            setSearchOptionsError(null);
          } else {
            setSearchOptionsError(
              result.error.errors.at(0)?.message || "Invalid Search Options",
            );
          }
        }}
        value={() => {
          return extraParams?.searchOptions || {};
        }}
        onError={(message) => {
          setSearchOptionsError(message);
        }}
      />
      <Show when={searchOptionsError()}>
        <div class="text-red-500">{searchOptionsError()}</div>
      </Show>
    </div>
  );
};

// Text area switches between preview and input
const HtmlEditor = (props: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <textarea
      class="w-full rounded border border-neutral-300 px-3 py-1.5 font-mono shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
      rows={6}
      value={props.value}
      onInput={(e) => {
        props.onValueChange(e.currentTarget.value);
      }}
    />
  );
};

export const OgOptions = () => {
  const { extraParams, setExtraParams } = usePublicPage();
  const [defaultDetailOpen] = createSignal(
    !!extraParams.openGraphMetadata?.title ||
      !!extraParams.openGraphMetadata?.image ||
      !!extraParams.openGraphMetadata?.description,
  );

  return (
    <details class="pt-2" open={defaultDetailOpen()}>
      <summary class="cursor-pointer text-sm font-medium">Open Graph</summary>
      <div class="flex gap-4 pt-2">
        <div class="grow">
          <label class="block">OG Title</label>
          <input
            placeholder="Title of the page"
            value={extraParams.openGraphMetadata?.title || ""}
            onInput={(e) => {
              setExtraParams("openGraphMetadata", {
                ...extraParams.openGraphMetadata,
                title: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
        <div class="grow">
          <label class="block">OG Image</label>
          <input
            placeholder="Image URL"
            value={extraParams.openGraphMetadata?.image || ""}
            onInput={(e) => {
              setExtraParams("openGraphMetadata", {
                ...extraParams.openGraphMetadata,
                image: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div class="flex gap-4 pb-2 pt-2">
        <div class="grow">
          <label class="block">OG Description</label>
          <textarea
            cols={2}
            placeholder="Description of the page"
            value={extraParams.openGraphMetadata?.description || ""}
            onInput={(e) => {
              setExtraParams("openGraphMetadata", {
                ...extraParams.openGraphMetadata,
                description: e.currentTarget.value,
              });
            }}
            class="block w-full rounded border border-neutral-300 px-3 py-1.5 shadow-sm placeholder:text-neutral-400 focus:outline-magenta-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </details>
  );
};

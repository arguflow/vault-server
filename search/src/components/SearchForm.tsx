import { BiRegularSearch, BiRegularX } from "solid-icons/bi";
import { useNavigate } from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "solid-headless";
import { FaSolidCheck } from "solid-icons/fa";
import { DatasetAndUserContext } from "./Contexts/DatasetAndUserContext";
import { FilterModal } from "./FilterModal";

const SearchForm = (props: {
  query?: string;
  searchType: string;
  groupUniqueSearch?: boolean;
  groupID?: string;
}) => {
  const datasetAndUserContext = useContext(DatasetAndUserContext);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const $envs = datasetAndUserContext.clientConfig;
  const navigate = useNavigate();

  const [searchTypes, setSearchTypes] = createSignal([
    { name: "FullText", isSelected: false, route: "fulltext" },
    { name: "Semantic", isSelected: true, route: "semantic" },
    { name: "Hybrid", isSelected: false, route: "hybrid" },
  ]);
  const [textareaInput, setTextareaInput] = createSignal("");
  const [typewriterEffect, setTypewriterEffect] = createSignal("");
  const [textareaFocused, setTextareaFocused] = createSignal(false);
  const [showFilters, setShowFilters] = createSignal(false);
  const [groupUniqueSearch, setGroupUniqueSearch] = createSignal(
    // eslint-disable-next-line solid/reactivity
    props.groupUniqueSearch ?? false,
  );

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const textAreaValue = textareaInput();
    if (!textAreaValue) return;

    const searchQuery = encodeURIComponent(
      textAreaValue.length > 3800
        ? textAreaValue.slice(0, 3800)
        : textAreaValue,
    );

    const searchTypeRoute =
      searchTypes().find((type) => type.isSelected)?.route ?? "hybrid";
    const searchTypeUrlParam = searchTypeRoute
      ? `&searchType=${searchTypeRoute}`
      : "";

    const groupUniqueUrlParam = groupUniqueSearch() ? "&groupUnique=true" : "";

    const urlToNavigateTo = props.groupID
      ? `/group/${props.groupID}?q=${searchQuery}` +
        searchTypeUrlParam +
        groupUniqueUrlParam
      : `/search?q=${searchQuery}` + searchTypeUrlParam + groupUniqueUrlParam;

    navigate(urlToNavigateTo);
  };

  createEffect(() => {
    setTextareaInput(props.query ?? "");

    setSearchTypes((prev) => {
      return prev.map((item) => {
        if (props.searchType == item.route) {
          return { ...item, isSelected: true };
        } else {
          return { ...item, isSelected: false };
        }
      });
    });

    setTimeout(() => {
      resizeTextarea(document.querySelector("#search-query-textarea"));
    }, 5);
  });

  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textareaVal();

    resizeTextarea(document.querySelector("#search-query-textarea"));
  });

  createEffect(() => {
    const shouldNotRun = textareaInput() || textareaFocused();

    if (shouldNotRun) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const textArray: string[] = $envs().SEARCH_QUERIES?.split(",") ?? [];

    const typingSpeed = 50;
    const deleteSpeed = 30;

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    let timeoutRefOne: number;
    let timeoutRefTwo: number;
    let timeoutRefThree: number;

    const typeText = () => {
      const currentText = textArray[currentTextIndex];

      if (isDeleting) {
        setTypewriterEffect(currentText.substring(0, currentCharIndex - 1));
        currentCharIndex--;
      } else {
        setTypewriterEffect(currentText.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      }

      if (!isDeleting && currentCharIndex === currentText.length) {
        isDeleting = true;
        timeoutRefOne = setTimeout(typeText, 1000);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % textArray.length;
        timeoutRefTwo = setTimeout(typeText, typingSpeed);
      } else {
        const speed = isDeleting ? deleteSpeed : typingSpeed;
        timeoutRefThree = setTimeout(typeText, speed);
      }
    };

    typeText();

    onCleanup(() => {
      clearTimeout(timeoutRefOne);
      clearTimeout(timeoutRefTwo);
      clearTimeout(timeoutRefThree);
    });
  });

  createEffect(() => {
    $envs().CREATE_CHUNK_FEATURE?.valueOf();
  });

  const textareaVal = createMemo(() => {
    const textareaInputVal = textareaInput();
    const textareaFocusedVal = textareaFocused();
    const typewriterEffectVal = typewriterEffect();
    const textareaVal =
      textareaInputVal ||
      (textareaFocusedVal ? textareaInputVal : typewriterEffectVal);

    return textareaVal;
  });

  return (
    <>
      <div class="w-full">
        <form class="w-full space-y-4 dark:text-white" onSubmit={onSubmit}>
          <div class="relative flex">
            <div
              classList={{
                "flex w-full justify-center space-x-2 rounded-md bg-neutral-100 px-4 py-1 pr-[10px] dark:bg-neutral-700":
                  true,
              }}
            >
              <BiRegularSearch class="mt-1 h-6 w-6 fill-current" />
              <textarea
                id="search-query-textarea"
                classList={{
                  "scrollbar-track-rounded-md scrollbar-thumb-rounded-md mr-2 h-fit max-h-[240px] w-full resize-none whitespace-pre-wrap bg-transparent py-1 scrollbar-thin scrollbar-track-neutral-200 scrollbar-thumb-neutral-400 focus:outline-none dark:bg-neutral-700 dark:text-white dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-600":
                    true,
                  "text-neutral-600": !textareaInput() && !textareaFocused(),
                }}
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
                value={textareaVal()}
                onInput={(e) => {
                  setTextareaInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    ((e.ctrlKey || e.metaKey) && e.key === "Enter") ||
                    (!e.shiftKey && e.key === "Enter")
                  ) {
                    onSubmit(e);
                  }
                }}
                rows="1"
              />
              <Show when={textareaInput()}>
                <button
                  classList={{
                    "pt-[2px]": !!props.query,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setTextareaInput("");
                  }}
                >
                  <BiRegularX class="h-7 w-7 fill-current" />
                </button>
              </Show>
              <Show when={props.query}>
                <button
                  classList={{
                    "border-l border-neutral-600 pl-[10px] dark:border-neutral-200":
                      !!textareaInput(),
                  }}
                  type="submit"
                >
                  <BiRegularSearch class="mt-1 h-6 w-6 fill-current" />
                </button>
              </Show>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              classList={{
                "flex items-center space-x-1 text-sm pb-1 rounded": true,
                "bg-neutral-200 dark:bg-neutral-700": showFilters(),
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowFilters(!showFilters());
              }}
            >
              <span class="p-1">Filters</span>
            </button>
            <Popover defaultOpen={false} class="relative">
              {({ isOpen, setState }) => (
                <>
                  <PopoverButton
                    aria-label="Toggle filters"
                    type="button"
                    class="flex items-center space-x-1 pb-1 text-sm"
                  >
                    <span class="p-1">
                      Type:{" "}
                      {searchTypes().find((type) => type.isSelected)?.name ??
                        "Hybrid"}
                    </span>{" "}
                    <svg
                      fill="currentColor"
                      stroke-width="0"
                      style={{ overflow: "visible", color: "currentColor" }}
                      viewBox="0 0 16 16"
                      class="h-3.5 w-3.5 "
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 5.56L2.413 5h11.194l.393.54L8.373 11h-.827L2 5.56z" />
                    </svg>
                  </PopoverButton>
                  <Show when={isOpen()}>
                    <PopoverPanel
                      unmount={false}
                      class="absolute z-10 mt-2 h-fit w-[180px]  rounded-md bg-neutral-200 p-1 shadow-lg dark:bg-neutral-800"
                    >
                      <Menu class="ml-1 space-y-1">
                        <For each={searchTypes()}>
                          {(option) => {
                            if (props.groupID && option.route === "hybrid") {
                              return <></>;
                            }

                            const onClick = (e: Event) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSearchTypes((prev) => {
                                return prev.map((item) => {
                                  if (item.name === option.name) {
                                    return { ...item, isSelected: true };
                                  } else {
                                    return { ...item, isSelected: false };
                                  }
                                });
                              });
                              setState(true);
                              onSubmit(e);
                            };
                            return (
                              <MenuItem
                                as="button"
                                classList={{
                                  "flex w-full items-center justify-between rounded p-1 focus:text-black focus:outline-none dark:hover:text-white dark:focus:text-white":
                                    true,
                                  "bg-neutral-300 dark:bg-neutral-900":
                                    option.isSelected,
                                }}
                                onClick={onClick}
                              >
                                <div class="flex flex-row justify-start space-x-2">
                                  <span class="text-left">{option.name}</span>
                                </div>
                                {option.isSelected && (
                                  <span>
                                    <FaSolidCheck class="fill-current text-xl" />
                                  </span>
                                )}
                              </MenuItem>
                            );
                          }}
                        </For>
                      </Menu>
                    </PopoverPanel>
                  </Show>
                </>
              )}
            </Popover>
            <Show when={!props.groupID}>
              <div class="flex-1" />
              <div class="flex items-center space-x-1 justify-self-center">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  checked={props.groupUniqueSearch}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setGroupUniqueSearch(true);
                    } else {
                      setGroupUniqueSearch(false);
                    }

                    onSubmit(e);
                  }}
                />
                <div class="flex items-center space-x-1">
                  <label class="text-sm">Group Search</label>
                </div>
              </div>
            </Show>
          </div>
        </form>
      </div>
      <FilterModal
        showFilterModal={showFilters}
        setShowFilterModal={setShowFilters}
      />
    </>
  );
};

export default SearchForm;

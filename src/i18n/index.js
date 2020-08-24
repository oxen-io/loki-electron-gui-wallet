import enUS from "./en-us";

// ADD LANGUAGES HERE
const languages = [
  { name: "English", code: "en-us", flag: "gb" },
  { name: "Russian", code: "ru", flag: "ru" },
  { name: "German", code: "de", flag: "de" },
  { name: "French", code: "fr", flag: "fr" },
  { name: "Spanish", code: "es", flag: "es" },
  { name: "Portuguese", code: "pt-br", flag: "pt" }
];

export { languages };

// DO NOT MODIFY THIS EXPORT, LANGUAGE FILES CAN BE DYNAMICALLY LOADED
export default {
  "en-us": enUS
};

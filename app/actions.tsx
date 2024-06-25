"use server";

import { Installment } from "@/components/Installment";
import { InstallmentLoading } from "@/components/InstallmentLoading";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { streamUI } from "ai/rsc";
import { z } from "zod";

const getInstallmentCardStyle = async (bio: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      `Generate the css for an installment offer component card that would appeal to a user based on this bio in his or her Github profile: ${bio}.
       Please do not write any comments just write me the pure CSS. Please make sure that the contrast between the text color and background color of the card is high, use high contract colors only. Use TailwindCSS default colors on the background and on the text too! Please dont format just post the plain text! Please post only the css key value pairs and make the design modern and elegant!
       Here is the component div that you should style.` +
      '<div style="here">You payment details</div>',
  });

  if (text) {
    const cssWithoutSelectors = text
      .replace(/div:hover \{([^}]*)\}/g, "$1")
      .replace(/div \{([^}]*)\}/g, "$1");
    return cssWithoutSelectors.trim();
  }

  return "";
};

const getProductSuggestion = async (bio: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Please write a piece of advice on what a user can buy on credit, whose Github bio is this ${bio}.
         Also write the expected price for the item and a suggested emoji. Please answer me in exactly this JSON format for example:
         { item: "Macbook Pro", price: "2000", emoji: "💻" }`,
  });

  return JSON.parse(text) as {
    item: string;
    price: number;
    emoji: string;
    imgUrl: string;
  };
};

const cssStringToObject = (cssString: string) => {
  const cssObject: { [key: string]: string } = {};
  const cssArray = cssString.split(";");

  cssArray.forEach((rule) => {
    const [property, value] = rule.split(":");
    if (property && value) {
      const formattedProperty = property
        .trim()
        .replace(/-./g, (c) => c.toUpperCase()[1]);
      cssObject[formattedProperty] = value.trim();
    }
  });

  return cssObject;
};

export async function streamComponent(bio: string) {
  const result = await streamUI({
    model: openai("gpt-4o"),
    prompt: "Get the loan offer for the user",
    tools: {
      getLoanOffer: {
        description: "Get a loan offer for the user",
        parameters: z.object({}),
        generate: async function* () {
          yield <InstallmentLoading />;
          const styleString = await getInstallmentCardStyle(bio);
          const style = cssStringToObject(styleString);
          const product = await getProductSuggestion(bio);
          return <Installment styles={style} productItem={product} />;
        },
      },
    },
  });

  return result.value;
}

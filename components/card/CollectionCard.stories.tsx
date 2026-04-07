import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CollectionCard from "./CollectionCard";

const googlePlaceImage =
  "https://lh3.googleusercontent.com/place-photos/AL8-SNGXZ_Us7rOZRINj0R36N9ISbrtfm5cm14nYyeBULBAzzog9MXOu8j96zZaJWrK_7pCAbjqz1qbn-gu6CZcQOPI0pTtFdLkNPj7a3RPmrwy_VcHBP6gItRJ1zfrjsqOIupwPC-x3AqLZ8anG7w=s4800-w800";

const meta = {
  title: "Cards/CollectionCard",
  component: CollectionCard,
  tags: ["autodocs"],
  args: {
    title: "Seoul Cafe Archive",
    memberCount: 3,
  },
} satisfies Meta<typeof CollectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: googlePlaceImage,
  },
};

export const WithoutImage: Story = {
  args: {
    imageSrc: undefined,
  },
};

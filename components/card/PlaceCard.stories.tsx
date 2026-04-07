import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceCard from "./PlaceCard";

const googlePlaceImage =
  "https://lh3.googleusercontent.com/place-photos/AL8-SNGXZ_Us7rOZRINj0R36N9ISbrtfm5cm14nYyeBULBAzzog9MXOu8j96zZaJWrK_7pCAbjqz1qbn-gu6CZcQOPI0pTtFdLkNPj7a3RPmrwy_VcHBP6gItRJ1zfrjsqOIupwPC-x3AqLZ8anG7w=s4800-w800";

const meta = {
  title: "Cards/PlaceCard",
  component: PlaceCard,
  tags: ["autodocs"],
  args: {
    title: "Blue Bottle Seongsu",
    address: "Seoul Seongdong-gu",
    likeCount: 12,
    rejectCount: 2,
    imageSrc: googlePlaceImage,
  },
} satisfies Meta<typeof PlaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Picked: Story = {
  args: {
    myPreference: "PICK",
  },
};

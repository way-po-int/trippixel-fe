import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlanCard from "./PlanCard";

const googlePlaceImage =
  "https://lh3.googleusercontent.com/place-photos/AL8-SNGXZ_Us7rOZRINj0R36N9ISbrtfm5cm14nYyeBULBAzzog9MXOu8j96zZaJWrK_7pCAbjqz1qbn-gu6CZcQOPI0pTtFdLkNPj7a3RPmrwy_VcHBP6gItRJ1zfrjsqOIupwPC-x3AqLZ8anG7w=s4800-w800";

const meta = {
  title: "Cards/PlanCard",
  component: PlanCard,
  tags: ["autodocs"],
  args: {
    title: "Spring Tokyo Sprint",
    memberCount: 4,
    dateRange: "2026.04.20 - 2026.04.24",
    imageSrc: googlePlaceImage,
  },
} satisfies Meta<typeof PlanCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutImage: Story = {
  args: {
    imageSrc: undefined,
  },
};

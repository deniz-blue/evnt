import type { Route } from "./+types/home";
import { Container, Title, Text, Button, Group, Stack } from "@mantine/core";
import { IconHome, IconCalendar } from "@tabler/icons-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Events Format" },
    { name: "description", content: "Events Format Application" },
  ];
}

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg" align="center">
        <Title order={1}>Events Format</Title>
        <Text c="dimmed" ta="center">
          Welcome to the Events Format application built with React Router v7, Mantine, and TypeScript.
        </Text>
        <Group>
          <Button leftSection={<IconHome size={16} />} variant="filled">
            Home
          </Button>
          <Button leftSection={<IconCalendar size={16} />} variant="outline">
            Calendar
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

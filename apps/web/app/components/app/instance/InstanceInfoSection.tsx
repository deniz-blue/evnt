import { Button, Group, Loader, Paper, Text } from "@mantine/core";
import { useEventRedirectorStore } from "../../../hooks/useEventRedirector";

export const InstanceInfoSection = () => {
    const { isActiveInstance, setAsActiveInstance } = useEventRedirectorStore();

    return (
        <Paper withBorder p="xs">
            {isActiveInstance === null ? (
                <Group>
                    <Loader size="sm" />
                    <Text>
                        Loading...
                    </Text>
                </Group>
            ) : (
                isActiveInstance === false ? (
                    <Group>
                        <Text>
                            This is not the active event instance.
                        </Text>
                        <Button size="xs" onClick={setAsActiveInstance}>
                            Set as active instance
                        </Button>
                    </Group>
                ) : (
                    <Group>
                        <Text>
                            This is the active event instance.
                        </Text>
                    </Group>
                )
            )}
        </Paper>
    );
};

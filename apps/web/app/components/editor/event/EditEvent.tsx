import { Stack, Text, Title } from "@mantine/core";
import { EditEventDetails } from "./EditEventDetails";
import { EditEventInstanceList } from "./EditEventInstanceList";
import type { EventData } from "../../../../../../packages/schema/src/schemas/EventData";
import type { EditAtom } from "../edit-atom";
import { EditVenuesList } from "./EditVenuesList";

export const EditEvent = ({ data }: { data: EditAtom<EventData> }) => {
	return (
		<Stack>
			<EditEventDetails data={data} />
			<EditEventInstanceList data={data} />

			<EditVenuesList
				data={data}
			/>

			{/* Shared Venues (in more than one instances) */}
			{/* <EditVenuesList
				data={data}
				title={(amt) => (
					<Title order={3}>
						Shared Venues ({amt})
					</Title>
				)}
				filter={(venue, data) => (
					(data.instances?.filter(instance => instance.venueIds?.includes(venue.venueId)).length ?? 0) > 1
				)}
			/> */}
			{/* Stray Venues (not in any instance) */}
			{/* <EditVenuesList
				data={data}
				title={(amt) => (
					<Stack gap={4}>
						<Title order={3}>Stray Venues ({amt})</Title>
						<Text c="dimmed">
							These venues aren't assigned to any instance
						</Text>
					</Stack>
				)}
				filter={(venue, data) => (
					!data.instances?.some(instance => instance.venueIds?.includes(venue.venueId))
				)}
			/> */}
		</Stack>
	);
};

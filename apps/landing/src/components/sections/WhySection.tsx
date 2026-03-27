import { Anchor, Image, List, Text } from "@mantine/core";
import { Section } from "../Section";

export const WhySection = () => {
	return (
		<Section title="Why?">
			<Text>
				Currently for calendaring on the web, the de-facto standard is iCal. However, iCal has a number of issues that make it difficult to use.
			</Text>
			<Text>
				If you have ever tried to use iCal or the applications that use it (e.g., Apple Calendar, Google Calendar), you have probably run into some of these issues as a user:
			</Text>

			<List>
				<List.Item>
					Calendar applications often have poor support for iCal, leading to inconsistent and unreliable behavior across different applications.
				</List.Item>
				<List.Item>
					You can't reliably have more detailed information using iCal, such as events with multiple locations like hybrid events, events that span multiple days, uncertain dates, localized event names and descriptions, and more.
				</List.Item>
				<List.Item>
					You can share events using iCal, but it is not very reliable and often leads to vendor lock-in.
				</List.Item>
				<List.Item>
					Many websites that list events do not work using iCal, and instead use their own proprietary formats that are not interoperable with other applications.
				</List.Item>
			</List>

			<Text>
				And if you are a developer, you have probably run into some of these issues as well:
			</Text>

			<List>
				<List.Item>
					iCal is a complex format with many edge cases and quirks that make it difficult to implement correctly. This has led to a number of bugs and inconsistencies in iCal implementations.
				</List.Item>
				<List.Item>
					iCal is not designed to be extensible, making it difficult to add new features or support new types of events. This has led to a number of workarounds and hacks in iCal implementations.
				</List.Item>
			</List>

			<Text>
				<Text inline inherit span fw="bold">Open Evnt</Text> is designed to fix these issues by providing a modern, extensible, and easy-to-use data format for events. It is based on JSON, which is a widely used and well-supported data format that is easy to work with for developers.
			</Text>

			<Text>
				The idea is simple: define a common format for calendar applications, event management systems, event listing sites and others to use for representing events. This allows for better interoperability between different applications and services, and makes it easier for developers to create new applications and services that work with events.
			</Text>

			<Text>
				So yes, we are reinventing the wheel: <Anchor href="https://xkcd.com/927/" target="_blank" rel="noopener noreferrer">
					XKCD 927
				</Anchor>
			</Text>
		</Section>
	)
};

import { Container, Space, Stack } from "@mantine/core";
import { ValidatorSection } from "./sections/ValidatorSection";
import { HeroSection } from "./sections/HeroSection";
import { WhySection } from "./sections/WhySection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ExampleSection } from "./sections/ExampleSection";
import { ApplicationsSection } from "./sections/ApplicationsSection";
import { SpecificationSection } from "./sections/SpecificationSection";
import { ATProtoSection } from "./sections/ATProtoSection";
import { ComparisionSection } from "./sections/ComparisionSection";

export const LandingPage = () => {
	return (
		<Container size="sm">
			<Stack gap="10rem" w="100%">
				<HeroSection />
				<WhySection />
				<FeaturesSection />
				<ApplicationsSection />
				<SpecificationSection />
				<ATProtoSection />
				<ComparisionSection />
				<ExampleSection />
				<ValidatorSection />
				<Space h="100dvh" />
			</Stack>
		</Container>
	)
};

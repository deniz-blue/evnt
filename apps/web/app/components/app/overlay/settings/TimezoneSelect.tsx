import { OsuSelect } from "../../../base/input/OsuSelect";

export const TimezoneSelect = () => {
	return (
		<OsuSelect
			value="UTC"
			onChange={(value) => console.log("Selected timezone:", value)}
			options={[
				{ value: "UTC", label: "Coordinated Universal Time (UTC)" },
				{ value: "PST", label: "Pacific Standard Time (PST)" },
				{ value: "EST", label: "Eastern Standard Time (EST)" },
				{ value: "CET", label: "Central European Time (CET)" },
				{ value: "IST", label: "India Standard Time (IST)" },
			]}
		/>
	);
};

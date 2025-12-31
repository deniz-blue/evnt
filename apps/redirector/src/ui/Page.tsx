export const Page = ({ failed }: { failed: boolean }) => {
	return (
		<main>
			<h1>Event Redirector</h1>
			{failed && (
				<p>
					To complete the action, please select an instance
				</p>
			)}
			<p>
				TODO: instances list
			</p>
		</main>
	)
}

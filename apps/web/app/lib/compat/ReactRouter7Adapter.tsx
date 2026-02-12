import { useRef } from "react"
import { useLocation, useNavigate, type Location } from "react-router"
import { type QueryParamAdapterComponent, type PartialLocation } from "use-query-params";

export const ReactRouter7Adapter: QueryParamAdapterComponent = ({ children }) => {
	const navigate = useNavigate()
	const location = useLocation()

	const locationRef = useRef<Location>(location)
	locationRef.current = location

	return children({
		get location() {
			return locationRef.current
		},
		push: ({ search, state }: PartialLocation) => {
			locationRef.current = { ...locationRef.current, search, state }
			navigate({ search }, { state })
		},
		replace: ({ search, state }: PartialLocation) => {
			locationRef.current = { ...locationRef.current, search, state }
			navigate({ search }, { replace: true, state })
		},
	})
}

import type { EventData } from "@evnt/schema";
import type { $ZodIssue } from "zod/v4/core";

export namespace EventEnvelope {
	export type Rev = {
		// http/https sources
		etag?: string;

		// atproto sources
		cid?: string;
	};

	export interface JSONParseError {
		kind: "json-parse";
		message: string;
	};

	export interface ValidationError {
		kind: "validation";
		issues: $ZodIssue[];
	};

	export interface FetchError {
		kind: "fetch";
		message: string;
		status?: number;
	};

	export interface XRPCError {
		kind: "xrpc";
		error: string;
		message?: string;
		status: number;
	};

	export type Error = ValidationError | FetchError | JSONParseError | XRPCError;
};

export interface EventEnvelope {
	data: EventData | null;
	rev?: EventEnvelope.Rev;
	err?: EventEnvelope.Error;
};

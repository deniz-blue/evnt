import { findNodeAtLocation, parseTree } from "jsonc-parser";
import z, { ZodError } from "zod";
import * as core from '@actions/core';
import { codeFrameColumns } from "@babel/code-frame";

const getPosition = (text: string, offset: number) => {
    return {
        line: text.slice(0, offset).split('\n').length - 1,
        column: offset - text.lastIndexOf('\n', offset - 1) - 1,
    };
};

export class SchemaValidationError extends Error {
    constructor(public path: string, public zodError: ZodError, public fileContent: string) {
        super();
    }

    prettify() {
        return z.prettifyError(this.zodError);
    }

    getCodeFrames() {
        const frames: string[] = [];
        for (const issue of this.zodError.issues) {
            const json = parseTree(this.fileContent);
            if (json == null) continue;
            const node = findNodeAtLocation(json, issue.path as (string | number)[]);
            if (node == null) continue;
            const start = getPosition(this.fileContent, node.offset);
            const end = getPosition(this.fileContent, node.offset + node.length);
            const frame = codeFrameColumns(
                this.fileContent,
                {
                    start: { line: start.line + 1, column: start.column + 1 },
                    end: { line: end.line + 1, column: end.column + 1 },
                },
                { highlightCode: true, message: issue.message },
            );
            frames.push(`Issue: ${issue.message}\n${frame}`);
        }
        return this.path + "\n\n" +frames.join('\n');
    }

    annotate() {
        const json = parseTree(this.fileContent);
        if (json == null) return;
        for (const issue of this.zodError.issues) {
            const node = findNodeAtLocation(json, issue.path as (string | number)[]);
            core.error(issue.message, {
                file: this.path,
                startLine: node?.offset != null ? getPosition(this.fileContent, node.offset).line + 1 : undefined,
                startColumn: node?.offset != null ? getPosition(this.fileContent, node.offset).column + 1 : undefined,
                endLine: node?.length != null ? getPosition(this.fileContent, node.offset + node.length).line + 1 : undefined,
                endColumn: node?.length != null ? getPosition(this.fileContent, node.offset + node.length).column + 1 : undefined,
            });
        }
    }
}

export class JSONParseError extends Error {
    constructor(public path: string, public syntaxError: SyntaxError) {
        super();
    }

    annotate() {
        core.error(`Invalid JSON file!`, {
            file: this.path,
        });
    }
}

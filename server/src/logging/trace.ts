import type express from 'express';
export interface TraceInfo {
  traceId: string;
  parentId: string;
  isSampled: boolean;
}

export function extractTrace(req: express.Request): TraceInfo | undefined {
  return extractTraceparent(req) ?? extractXCloudTraceContext(req);
}

// ref. https://www.w3.org/TR/trace-context/
export function extractTraceparent(req: express.Request): TraceInfo | undefined {
  const traceparentHeader = req.header('traceparent');
  if (!traceparentHeader) {
    return undefined;
  }

  const parts = traceparentHeader.split('-');
  if (parts.length !== 4) {
    return undefined;
  }

  const [version, traceId, parentId, traceFlags] = parts;

  // Validate version: 2 HEXDIGLC
  if (!/^[0-9a-f]{2}$/.test(version) || version === 'ff') {
    return undefined;
  }

  // Validate trace-id: 32 HEXDIGLC. All zeroes forbidden.
  if (!/^[0-9a-f]{32}$/.test(traceId) || traceId === '00000000000000000000000000000000') {
    return undefined;
  }

  // Validate parent-id: 16 HEXDIGLC. All zeroes forbidden.
  if (!/^[0-9a-f]{16}$/.test(parentId) || parentId === '0000000000000000') {
    return undefined;
  }

  // Validate trace-flags: 2 HEXDIGLC
  if (!/^[0-9a-f]{2}$/.test(traceFlags)) {
    return undefined;
  }

  // Determine isSampled from traceFlags
  // The least significant bit (LSB) of traceFlags determines sampling.
  // '01' (binary 00000001) means sampled.
  const flagsByte = parseInt(traceFlags, 16);
  const isSampled = (flagsByte & 1) === 1;

  return {
    traceId,
    parentId,
    isSampled,
  };
}

// ref. https://cloud.google.com/trace/docs/trace-context?hl=ja#legacy-http-header
export function extractXCloudTraceContext(req: express.Request): TraceInfo | undefined {
  const xCloudTraceContextHeader = req.header('x-cloud-trace-context') ?? '';

  const traceAndSpan = xCloudTraceContextHeader.split('/');
  const trace = traceAndSpan.at(0);
  const span = traceAndSpan.at(1);
  if (span) {
    const spanAndOption = span.split(';o=');
    const spanId = spanAndOption.at(0);
    const sampled = spanAndOption.at(1);
    if (trace && spanId && sampled) {
      return {
        traceId: trace,
        parentId: spanId,
        isSampled: sampled === '1',
      };
    }
  }
  return undefined;
}

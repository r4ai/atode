import * as v from "valibot"

// Response schemas
export const ApiResponseSchema = <
  T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  dataSchema: T,
) =>
  v.object({
    data: dataSchema,
    message: v.optional(v.string()),
    status: v.picklist(["success", "error"]),
  })

export const ErrorResponseSchema = v.object({
  error: v.string(),
  message: v.string(),
  status: v.literal("error"),
  details: v.optional(v.record(v.string(), v.any())),
})

// Type exports
export type ApiResponse<_T> = v.InferOutput<
  ReturnType<typeof ApiResponseSchema>
>
export type ErrorResponse = v.InferOutput<typeof ErrorResponseSchema>
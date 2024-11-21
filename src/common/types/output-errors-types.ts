import { UserInputModel } from "../../features/users/models/users.models";

export type FieldNamesType = keyof UserInputModel;

type ErrorMessageType = {
  message: string;
  field: string;
};

export type OutputErrorsType = {
  message?: string;
  errorsMessages: ErrorMessageType[];
};

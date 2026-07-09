import React from "react";
import { RuleContextProps } from "./types";

const RuleContext: React.Context<RuleContextProps> =
  React.createContext<RuleContextProps>({
    editKey: "",
    editable: true,
  });

export default RuleContext;

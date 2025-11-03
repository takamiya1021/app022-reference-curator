import { expectTypeOf } from "tsd";
import { ImageData, Tag, AppSettings } from "./index";

expectTypeOf<ImageData>().toBeObject();
expectTypeOf<Tag>().toBeObject();
expectTypeOf<AppSettings>().toBeObject();

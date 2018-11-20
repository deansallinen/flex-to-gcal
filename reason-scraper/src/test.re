/* (* prints { x: 42, foo: 'bar' } *) */
open Json;
let _ =
  [|"foo", "bar"|] |> Json.Encode.stringArray |> Json.stringify |> Js.log;
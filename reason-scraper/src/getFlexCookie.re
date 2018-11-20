Js.log("Hello, BuckleScript and Reason!");
open Axios;
/* open Json; */

[@bs.deriving abstract]
type auth = {
  .
  "username": string,
  "password": string,
};

let auth_url = "https://loungeworks.flexrentalsolutions.com/rest/core/authenticate";

let body = {
  "body": {
    username: "ds",
    password: "IsErsite8",
  },
};
Js.log(body);
Js.log @@ Js.Json.stringify(body);

let inst =
  Instance.create(
    makeConfig(
      ~baseURL="https://loungeworks.flexrentalsolutions.com",
      ~headers=body,
      (),
    ),
  );

/* Js.Promise.(
     Instance.post(inst, "/rest/core/authenticate")
     |> then_(resp => resolve(Js.log(resp##data)))
     |> catch(error => resolve(Js.log(error)))
   ); */

/* Js.Promise.(
     Axios.get("https://flex-to-gcal.now.sh/v1/events/toinsert")
     |> then_(response => resolve(Js.log(response##data)))
     |> catch(error => resolve(Js.log(error)))
   ); */
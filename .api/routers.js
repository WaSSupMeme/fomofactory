
// Imports
import * as _0_0 from "@api/root/src/api/paymaster/index.ts";
import * as configure from "@api/configure";

export const routeBase = "/api";

const internal  = [
  _0_0.default && {
        source     : "src/api/paymaster/index.ts?fn=default",
        method     : "use",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.default,
      },
  _0_0.GET && {
        source     : "src/api/paymaster/index.ts?fn=GET",
        method     : "get",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.GET,
      },
  _0_0.PUT && {
        source     : "src/api/paymaster/index.ts?fn=PUT",
        method     : "put",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.PUT,
      },
  _0_0.POST && {
        source     : "src/api/paymaster/index.ts?fn=POST",
        method     : "post",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.POST,
      },
  _0_0.PATCH && {
        source     : "src/api/paymaster/index.ts?fn=PATCH",
        method     : "patch",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.PATCH,
      },
  _0_0.DELETE && {
        source     : "src/api/paymaster/index.ts?fn=DELETE",
        method     : "delete",
        route      : "/paymaster/",
        path       : "/api/paymaster/",
        url        : "/api/paymaster/",
        cb         : _0_0.DELETE,
      }
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, path, route, url, source } = it;
  return { method, url, path, route, source };
});

export const endpoints = internal.map(
  (it) => it.method?.toUpperCase() + "\t" + it.url
);

export const applyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};


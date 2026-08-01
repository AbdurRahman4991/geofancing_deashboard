import { api } from "../api/baseApi";

export const permissionSlice = api.injectEndpoints({
    endpoints:(builder)=>({

        getPermissions:builder.query({
            query:()=> "permissions",
            providesTags:["permission"]
        }),

    })
});

export const {
    useGetPermissionsQuery
}=permissionSlice;
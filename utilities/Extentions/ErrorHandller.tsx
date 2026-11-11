import axios from "axios";

import { Messenger } from "../Messenger";

export const errorHandle = (e: any) => {
    if (e === '' || e === undefined || e === null) {
        return;
    }
    if (axios.isAxiosError(e)) {
        const error = e.response;

        if (error && typeof error.data === "object" && "data" in error && "MetaData" in error.data && error.data.MetaData?.Message) {
            Messenger.errorMessage(error.data.MetaData.Message);
            console.log(error.data.MetaData.Message);
        }
        else if (Array.isArray(error?.data?.errors)) {
            for (const err of error.data.errors) {
                Messenger.errorMessage(err.description);
                console.log(err.description);
            }
        }
        else if (typeof error?.data?.errors === "object" && error?.data?.errors !== null) {
            for (const key in error.data.errors) {
                Messenger.errorMessage(error.data.errors[key][0]);
                console.log(error.data.errors[key][0]);
            }
        }
        else if (error?.data) {
            Messenger.errorMessage(error.data);
            console.log(error.data);
        }
        else if (error?.status === 401) {
            Messenger.errorMessage("لطفا وارد حساب کاربری خود شوید");
            console.log("لطفا وارد حساب کاربری خود شوید");
        }
        else if (e?.message) {
            Messenger.errorMessage(e.message);
            console.log(e.message);
        }
    }
    else if (e && typeof e === "object" && "MetaData" in e && e.MetaData?.Message) {
        Messenger.errorMessage(e.MetaData.Message);
        console.log(e.MetaData.Message);
    }
    else if (e instanceof Error) {
        Messenger.errorMessage(e.message);
        console.log(e.message);
    }
    else {
        Messenger.errorMessage("خطای ناشناخته‌ای رخ داده است");
        console.log("خطای ناشناخته‌ای رخ داده است");
    }
};

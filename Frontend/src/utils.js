import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    })
}

export const handleError = (msg,error) => {
    toast.error(msg, {
        position: 'top-right'
    })
    console.log(msg);
}
import Swal from 'sweetalert2';

const sweetAlert = {
    success(message, title = 'Success') {
        return Swal.fire({
            title,
            text: message,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    },

    error(message, title = 'Error') {
        return Swal.fire({
            title,
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    },

    warning(message, title = 'Warning') {
        return Swal.fire({
            title,
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    },

    info(message, title = 'Info') {
        return Swal.fire({
            title,
            text: message,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    },

    confirm({
        title = 'Are you sure?',
        text = "This action can't be undone.",
        confirmText = 'Yes',
        cancelText = 'Cancel'
    }) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        });
    }
};

export default sweetAlert;
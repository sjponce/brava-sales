import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import AuthModule from '@/modules/AuthModule';
import Loading from '@/components/Loading';


function DisableSeller() {
    return(
        <div>
        <p>
            HOLA MUUNDO
        </p>
        <button >
            Eliminar al vendedor
        </button>
    </div>
    )
    ;
}


export default DisableSeller;
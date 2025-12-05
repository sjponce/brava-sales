import { Typography } from '@mui/material';

const FinalMessaje = ({ orderState, ecommerce = false }) => (
  <>
    {!orderState.isLoading && orderState.isSuccess && (
      <Typography color="primary.light" variant="h6" align="center">
        {ecommerce ? (
          'Por favor, dirígete a la sección "Mis pedidos" o selecciona ver pedido para continuar con el pago.'
        ) : (
          <>
            Para continuar con la gestión acceda a editar orden.
            <br />
            Código de orden: {orderState.result?.salesOrder.salesOrderCode}
          </>
        )}
      </Typography>
    )}
    {!orderState.isLoading && !orderState.isSuccess && (
      <Typography color="primary.light" variant="h6" align="center">
        No se pudo generar el pedido, intente nuevamente más tarde.
      </Typography>
    )}
  </>
);

export default FinalMessaje;

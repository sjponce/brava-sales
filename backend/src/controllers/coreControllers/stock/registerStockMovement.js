const registerStockMovement = async (req, res, axiosInsance) => {
    try {
        const { type, ...movementData } = req.body;
    
        if (type !== 'input' && type !== 'output')
        return res.status(400).json({
            success: false,
            result: null,
            message: 'El tipo de movimiento no es valido',
        });
    
        const apiUrl = `${process.env.STOCK_API}/movement`;
        const stockCall = await axiosInsance.post(apiUrl, 
        {
            employeeId: 19,
            isMaterialMovement: false,
            type,
            ...movementData,
        });
    
        const stockData = stockCall.data;
    
        return res.status(200).json({
        success: true,
        result: stockData,
        message: 'Movimiento de stock registrado',
        });

    } catch (error) {
        console.error('Error registering stock movement:', error);
        return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor al registrar movimiento de stock',
        });
    }
    };

module.exports = registerStockMovement;    
    
import { VariantType } from 'notistack';
export interface CustomEnqueueSnackbarProps {
    (message: string,
        variant?: VariantType,
        horizontal?: "left" | "center" | "right",
        duration?:number
    ): void

}
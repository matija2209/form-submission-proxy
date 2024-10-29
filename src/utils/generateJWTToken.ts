import jwt from 'jsonwebtoken';

export const generateJWTToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string);
}
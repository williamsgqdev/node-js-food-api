import express, { Application } from "express";
import { AdminRoutes, ShoppingRoutes, UserRoutes, VendorRoutes } from "../routes";
import path from 'path';

export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/images', express.static( path.join(__dirname, '../images')));
    app.use('/admin', AdminRoutes);
    app.use('/vendors', VendorRoutes);
    app.use('/users', UserRoutes );
    app.use(ShoppingRoutes);

    return app;
}

import React from "react";
import { Screen, Card, H1, P } from "../ui/Components";

export default function PaymentPlanScreen() {
    return (
        <Screen>
            <Card>
                <H1>Payment Plan</H1>
                <P>Next: amount, down payment, months.</P>
            </Card>
        </Screen>
    );
}

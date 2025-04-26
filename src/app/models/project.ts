import {Category} from "./category";
import {Goal} from "./goal";
import {Investment} from "./investment";
import {Maturity} from "./maturity";
import {Reminder} from "./reminder";

export interface Project {
    id: number;
    name: string;
    categories: Category[];
    goals: Goal[];
    investments: Investment[];
    maturities: Maturity[];
    reminders: Reminder[];
}

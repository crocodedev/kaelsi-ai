import { Introduce } from "@/components/sections/natal-chart/introduce";
import { Main } from "@/components/main";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { Chart } from "@/components/sections/natal-chart/chart";
import { Subscription } from "@/components/subcription";

export default function NatalChart() {
    return (
        <Main className="flex flex-col justify-center items-center">
            <Introduce />
            {/* <BirthForm/> */}
            {/* <Chart/> */}
            {/* <Subscription/> */}
        </Main>
    )
}
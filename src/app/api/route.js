import axios from 'axios'

export async function GET(request) {
    try {
        const url = new URL(request.url)
        const spx_tn = url.searchParams.get('spx_tn')

        const res = await axios.get(
            `https://spx.co.th/shipment/order/open/order/get_order_info?spx_tn=${spx_tn}&language_code=th`
        )

        return Response.json(res.data)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}

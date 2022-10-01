<?php

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/reservations/{filterDate}', function ($filterDate){
    $result = [];

    $date = explode('-', $filterDate);
    
    $reservations = Reservation::whereYear('checkIn', $date[0])->whereMonth('checkIn', $date[1])->get();
    $totalIncome = 0;
    $totalAccomFare = 0;
    $totalCleanFare = 0;
    $totalTax = 0;
    $totalAdj = 0;
    $totalDisc = 0;
    $totalHostFee = 0;
    $totalBalanceDue = 0;
    $totalPaid = 0;
    $subtotalAerie = 0;
    $subtotalAerieNotAirBnb = 0;
    $subtotal20260 = 0;
    $subtotal304 = 0;
    foreach($reservations as $reservation){
        $listing = json_decode($reservation->listing);
        $money = json_decode($reservation->money);

        $totalIncome += $money->netIncome;
        $totalAccomFare += $money->fareAccommodation;
        $totalCleanFare += $money->netIncome;
        $totalTax += !empty($money->totalTaxes) ? $money->totalTaxes : 0;
        $totalAdj += $money->fareAccommodationAdjustment;
        $totalDisc += $money->fareAccommodationDiscount;
        $totalHostFee += $money->hostServiceFee;
        $totalBalanceDue += $money->balanceDue;
        $totalPaid += $money->totalPaid;

        
        if(!empty($listing->nickname)){
            if(stripos(strtolower($listing->nickname), 'aerie') !== FALSE){
                $subtotalAerie += $money->netIncome;
                if($reservation->source != 'airbnb'){
                    $subtotalAerieNotAirBnb += $money->netIncome;
                }
            }
            elseif(stripos(strtolower($listing->nickname), '20260') !== FALSE){
                $subtotal20260 += $money->netIncome;
            }
            elseif(stripos(strtolower($listing->nickname), '304') !== FALSE){
                $subtotal304 += $money->netIncome;
            }
        }

        array_push($result, [
            'id' => $reservation->id,
            'listingNickname' => $listing->address->full,
            'checkIn' => date('d-m', strtotime($reservation->checkIn)),
            'checkInMonthYear' => date('Y-m', strtotime($reservation->checkIn)),
            'checkOut' => date('d-m', strtotime($reservation->checkOut)),
            'nights' => $reservation->nightsCount,
            'guest' => json_decode($reservation->guest),
            'source' => $reservation->source,
            'creationDate' => date('d-m', strtotime($reservation->created_at)),
            'netIncome' =>  '$'.number_format($money->netIncome, 2),
            'fareAccommodation' => '$'.number_format($money->fareAccommodation, 2),
            'fareCleaning' => '$'.number_format($money->fareCleaning, 2),
            'totalTaxes' => !empty($money->totalTaxes) ?  '$'.number_format($money->totalTaxes, 2) : 0,
            'fareAccommodationAdjustment' =>  '$'.number_format($money->fareAccommodationAdjustment, 2),
            'fareAccommodationDiscount' => '$'.number_format($money->fareAccommodationDiscount, 2),
            'hostServiceFee' =>  '$'.number_format($money->hostServiceFee, 2),
            'balanceDue' =>  '$'.number_format($money->balanceDue, 2),
            'totalPaid' =>  '$'.number_format($money->totalPaid, 2),
            'money' => json_decode($reservation->money),
            'confDate' => date('d-m', strtotime($reservation->confirmedAt)),
        ]);
    }

    return [
        'data' => $result,
        'totalIncome' => number_format($totalIncome, 2),
        'totalAccomFare' => number_format($totalAccomFare, 2),
        'totalCleanFare' => number_format($totalCleanFare, 2),
        'totalTax' => number_format($totalTax, 2),
        'totalAdj' => number_format($totalAdj, 2),
        'totalDisc' => number_format($totalDisc, 2),
        'totalHostFee' => number_format($totalHostFee, 2),
        'totalBalanceDue' => number_format($totalBalanceDue, 2),
        'totalPaid' => number_format($totalPaid, 2),
        'subtotalAerie' => number_format($subtotalAerie, 2),
        'subtotalAerieNotAirBnb' => number_format($subtotalAerieNotAirBnb, 2),
        'subtotal20260' => number_format($subtotal20260, 2),
        'subtotal304' => number_format($subtotal304, 2),
        'aerieSalesTax' => number_format($subtotalAerieNotAirBnb * .07, 2),
        'aerieSurTax' => number_format($subtotalAerieNotAirBnb * .01, 2),
        'total' => number_format($subtotalAerie + $subtotal20260 + $subtotal304, 2),
    ];
});
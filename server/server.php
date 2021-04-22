<?php
    $_INVERTER_DEVICE_COUNT = 8;
    
    $_DATA_FILE_PATH = "../data/data.json";
    $_DATA_FILE_PATH_HISTORY_FOLDER_PATH = "../data/history/";
    
    $_DATA_MONTH_REGISTRY_FOLDER_PATH = "../data/monthEnergyRegistry/";

    if (isset($_POST) && $_POST != null)
    {
            $action = null;
            if (isset($_POST['Action']))
            {
                $action = $_POST['Action'];
            }
            
            if ($action == null)
            {
                $rawData = file_get_contents('php://input');
                
                $data = json_decode($rawData);
                
                $date_raw = $data->Head->Timestamp;
                $date = date_create($date_raw);
                $dateSimplifySTR = date_format($date,"Y-m-d");
                
                $historyFileName = $dateSimplifySTR . ".json";
                $historyFileFullPath = $_DATA_FILE_PATH_HISTORY_FOLDER_PATH . $historyFileName;
                
                file_put_contents($_DATA_FILE_PATH, $rawData);
                file_put_contents($historyFileFullPath, $rawData);
                
                $monthRegistryFilePath = $_DATA_MONTH_REGISTRY_FOLDER_PATH . date_format($date,"Y-m") . ".json";
                $dayOfTheMonth = date_format($date,"d");
                
                $monthRegistryData;
                
                if (file_exists($monthRegistryFilePath))
                {
                        $rawMonthData = file_get_contents($monthRegistryFilePath);
                        $monthRegistryData = json_decode($rawMonthData);
                }
                else
                {
                    $monthRegistryData = new stdClass();
                }
                
                $totalEnergy = 0;
                for ($i = 0; $i < $_INVERTER_DEVICE_COUNT; $i++)
                {
                    $_i = $i + 1;
                    $totalEnergy = $totalEnergy + $data->Body->DAY_ENERGY->Values->$_i;
                }
                
                $monthRegistryData->Data->$dayOfTheMonth = $totalEnergy;
                $encodedMonthRegistry = json_encode($monthRegistryData);
                file_put_contents($monthRegistryFilePath, $encodedMonthRegistry);
                
                return;
            }
            else
            {
                switch($action)
                {
                    case "GetData":
                        $data = file_get_contents($_DATA_FILE_PATH);
                        echo $data === false ? "null" : $data;
                        break;
                        
                    case "GetDate":
                        $rawData = file_get_contents($_DATA_FILE_PATH);
                        $data = json_decode($rawData);
                        $date_raw = $data->Head->Timestamp;
                        $date = date_create($date_raw);
                        echo date_format($date,"Y-m-d H:i:s");
                    case "GetWeekReport":
                        $rawData = file_get_contents($_DATA_FILE_PATH);
                        $data = json_decode($rawData);
                        $date_raw = $data->Head->Timestamp;
                        $date = date_create($date_raw);
                        
                        $response = new stdClass();
                        $response->startingDayOfWeekIndex = date_format($date,"N");
                        $response->days[0] = $rawData;
                        
                        $daysToCheck = 7;
                        for ($i = 1; $i < $daysToCheck; $i++)
                        {
                            $date->modify('-1 days');
                            $dateSimplifySTR = date_format($date,"Y-m-d");
                            
                            
                            $historyFileName = $dateSimplifySTR . ".json";
                            $historyFileFullPath = $_DATA_FILE_PATH_HISTORY_FOLDER_PATH . $historyFileName;
                            
                            if (file_exists($historyFileFullPath))
                            {
                                $nextFileRawData = file_get_contents($historyFileFullPath);
                                $response->days[$i] = $nextFileRawData;
                            }
                            else
                            {
                                $response->days[$i] = null;
                            }
                        }
                        
                        $encodedResponse = json_encode($response);
                        echo $encodedResponse;
                        break;
                        
                    case "GetTotalMonthEnergy":
                        $response = 0;
                        
                        $rawData = file_get_contents($_DATA_FILE_PATH);
                        $data = json_decode($rawData);
                        $date_raw = $data->Head->Timestamp;
                        $date = date_create($date_raw);
                        
                        $monthRegistryFilePath = $_DATA_MONTH_REGISTRY_FOLDER_PATH . date_format($date,"Y-m") . ".json";
                        $dayOfTheMonth = date_format($date,"d");
                
                        $monthRegistryData;
                
                        if (file_exists($monthRegistryFilePath))
                        {
                                $rawMonthData = file_get_contents($monthRegistryFilePath);
                                $monthRegistryData = json_decode($rawMonthData);
                                
                                $month = date_format($date,"m");
                                $year = date_format($date,"Y");
                                
                                $daysInTheMonth = cal_days_in_month(CAL_GREGORIAN,$month, $year );
                                
                                for ($i = 1; $i < $daysInTheMonth; $i++)
                                {
                                    if (isset($monthRegistryData->Data) && isset($monthRegistryData->Data->$i))
                                    {
                                       $response = $response + $monthRegistryData->Data->$i;
                                    }
                                }
                        }
                        
                        echo $response;
                        break;
                }
            }
    }
import React, { useState, useEffect } from 'react';
import { Text,} from 'react-native';

function app({mm,ss},{navigation}){
    const [minutes,setMinutes]=useState(parseInt(mm));
    const [seconds,setSeconds]=useState(parseInt(ss));

    useEffect(() => {
        const countdown = setInterval(() => {
          if (parseInt(seconds) > 0) {
            setSeconds(parseInt(seconds) - 1);
          }
          if (parseInt(seconds) === 0) {
            if (parseInt(minutes) === 0) {
                clearInterval(countdown);
            } else {
              setMinutes(parseInt(minutes) - 1);
              setSeconds(59);
            }
          }
        }, 1000);
        return () => clearInterval(countdown);
      }, [5, 0]);


    return(
        <Text>
            {minutes}:{seconds < 10 ? '0${seconds}':seconds}
        </Text>
    );
};

export default app;
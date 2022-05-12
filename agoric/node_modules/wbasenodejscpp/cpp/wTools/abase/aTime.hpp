#ifndef _wTools_abase_Time_hpp_ //
#define _wTools_abase_Time_hpp_

//

#include <chrono>

namespace wTools 
{
  namespace time 
  {
    constexpr auto &&now = std::chrono::high_resolution_clock::now;

    //

    template <typename T>
    std::chrono::nanoseconds toNanoseconds( T duration )
    {
      return std::chrono::duration_cast<std::chrono::nanoseconds>( duration );
    }

    //

    template <typename T>
    std::chrono::microseconds toMicroseconds( T duration )
    {
      return std::chrono::duration_cast<std::chrono::microseconds>( duration );
    }

    //

    template <typename T>
    std::chrono::milliseconds toMilliseconds( T duration )
    {
      return std::chrono::duration_cast<std::chrono::milliseconds>( duration );
    }

    //

    template <typename T>
    std::chrono::seconds toSeconds( T duration )
    {
      return std::chrono::duration_cast<std::chrono::seconds>( duration );
    }
  }
}

#endif // _wTools_abase_Time_hpp_

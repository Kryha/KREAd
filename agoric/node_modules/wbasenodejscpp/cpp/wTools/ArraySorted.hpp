#ifndef _wTools_ArraySorted_hpp_ //
#define _wTools_ArraySorted_hpp_

namespace wTools //
{

// template< Element_A >
// typedef Tuple< std::int32_t,std::int32_t> Range2d;

// template< typename Element_A >
// using Range2d = Tuple< Element_A,Element_A >;

// template< typename Element_A >
// template<>
// typedef Tuple< Element_A,Element_A > Range2d;

template< typename Container_A, typename Range_A >
inline
Range_A
arraySortedLookUpRange( Container_A* array, const Range_A& range )
{
  int rangeA = tupleElementGet_M( range, 0 );
  int rangeB = tupleElementGet_M( range, 1 );

  auto length = array->size();

  std::int32_t begin = 0;
  std::int32_t end = 0;

  auto left = std::lower_bound( array->begin(), array->end(), rangeA );

  auto right = std::upper_bound( array->begin(), array->end(), rangeB );

  begin = left - array->begin();
  end = right - array->begin();

  if( begin < length )
  BOOST_ASSERT( array->at( begin ) >= rangeA );

  if( begin > 0)
  BOOST_ASSERT( array->at( begin - 1 ) < rangeA );

  if( end < length )
  BOOST_ASSERT( array->at( end ) > rangeB);

  if( end > 0 )
  BOOST_ASSERT( array->at( end - 1 ) <= rangeB );

  return Range_A( begin, end );
}

//

template< typename Element_A >
inline
Element_A comparator( const Element_A& a, const Element_A& b )
{
  return a - b;
}

//

// template< typename Container_A, typename Element_A >
template< typename Container_A, typename Range_A >
inline
Range_A
arraySortedLookUpEmbrace( Container_A* array, const Range_A& range )
{
  int rangeA = tupleElementGet_M( range, 0 );
  int rangeB = tupleElementGet_M( range, 1 );

  auto length = array->size();

  std::int32_t begin = 0;
  std::int32_t end = 0;

  auto left = std::upper_bound( array->begin(), array->end(), rangeA );

  begin = left - array->begin();

  if( 0 < begin && begin < length )
  {
    if( comparator( array->at( begin ), rangeA ) > 0 )
    begin -= 1;
  }

  if( begin == length && !comparator( array->at( begin - 1 ),rangeA )  )
  begin-=1;

  if( begin == length || comparator( array->at( begin ),rangeB ) > 0 )
  return Range_A( begin, begin );

  auto right = std::lower_bound( array->begin() + begin + 1, array->end(), rangeB );

  end = right - array->begin();

  if( end > 0 )
  {
    if( end < length )
    if( comparator( array->at( end - 1 ), rangeB ) < 0 )
    end += 1;
  }
  else
  {
    BOOST_ASSERT( length > 0 );
    if( comparator( array->at( end ),rangeB ) <= 0 )
    end += 1;
  }

  if( begin > 0)
  BOOST_ASSERT( array->at( begin - 1 ) <= rangeA );

  if( end < length )
  BOOST_ASSERT( array->at( end ) >= rangeB);

  return Range_A( begin, end );
}

} // namespace wTools

#endif // _wTools_ArraySorted_hpp_

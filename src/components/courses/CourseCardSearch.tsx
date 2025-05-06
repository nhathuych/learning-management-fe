import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

const CourseCardSearch = ({ course, isSelected, onclick }: { course: Course, isSelected: boolean, onclick: any }) => {
  return (
    <div
      onClick={onclick}
      className={`course-card-search group ${isSelected ? 'course-card-search--selected' : 'course-card-search--unselected'}`}
    >
      <div className='course-card-search__image-container'>
        <Image
          src={course.image || 'placeholder.png'}
          alt={course.title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='course-card-search__image'
        />
      </div>

      <div className='course-card-search__content'>
        <div>
          <h2 className='course-card-search__title'>{course.title}</h2>
          <p className='course-card-search__description'>{course.description}</p>
        </div>

        <div className='mt-2'>
          <p className='course-card-search__teacher'>By {course.teacherName}</p>
          <div className='course-card-search__footer'>
            <span className='course-card-search__price'>{formatPrice(course.price)}</span>
            <span className='course-card-search__enrollment'>{course.enrollments?.length} Enrolled</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCardSearch

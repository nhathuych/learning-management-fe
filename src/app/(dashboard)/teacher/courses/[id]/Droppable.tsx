'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { deleteChapter, deleteSection, openChapterModal, openSectionModal, setSections } from '@/state'
import { useAppDispatch, useAppSelector } from '@/state/redux'
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react'

export default function DroppableComponent() {
  const dispatch = useAppDispatch()
  const { sections } = useAppSelector((state) => state.global.courseEditor)

  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    const updatedSections = [...sections]
    const [reorderedSection] = updatedSections.splice(startIndex, 1)
    updatedSections.splice(endIndex, 0, reorderedSection)
    dispatch(setSections(updatedSections))
  }

  const handleChapterDragEnd = (result: any, sectionIndex: number) => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    const updatedSections = [...sections]
    const updatedChapters = [...updatedSections[sectionIndex].chapters]
    const [reorderedChapter] = updatedChapters.splice(startIndex, 1)
    updatedChapters.splice(endIndex, 0, reorderedChapter)
    updatedSections[sectionIndex].chapters = updatedChapters
    dispatch(setSections(updatedSections))
  }

  return (
    <DragDropContext onDragEnd={handleSectionDragEnd}>
      <Droppable droppableId='sections'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((section: Section, sectionIndex: number) => (
              <Draggable
                key={section.sectionId}
                draggableId={section.sectionId}
                index={sectionIndex}
              >
                {(draggableProvider) => (
                  <div
                    ref={draggableProvider.innerRef}
                    {...draggableProvider.draggableProps}
                    className={`droppable-section ${
                      sectionIndex % 2 === 0
                        ? 'droppable-section--even'
                        : 'droppable-section--odd'
                    }`}
                  >
                    <SectionHeader
                      section={section}
                      sectionIndex={sectionIndex}
                      dragHandleProps={draggableProvider.dragHandleProps}
                    />

                    <DragDropContext
                      onDragEnd={(result) =>
                        handleChapterDragEnd(result, sectionIndex)
                      }
                    >
                      <Droppable droppableId={`chapters-${section.sectionId}`}>
                        {(droppableProvider) => (
                          <div
                            ref={droppableProvider.innerRef}
                            {...droppableProvider.droppableProps}
                          >
                            {section.chapters.map(
                              (chapter: Chapter, chapterIndex: number) => (
                                <Draggable
                                  key={chapter.chapterId}
                                  draggableId={chapter.chapterId}
                                  index={chapterIndex}
                                >
                                  {(draggableProvider) => (
                                    <ChapterItem
                                      chapter={chapter}
                                      chapterIndex={chapterIndex}
                                      sectionIndex={sectionIndex}
                                      draggableProvider={draggableProvider}
                                    />
                                  )}
                                </Draggable>
                              )
                            )}
                            {droppableProvider.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        dispatch(
                          openChapterModal({
                            sectionIndex,
                            chapterIndex: null,
                          })
                        )
                      }
                      className='group add-chapter-button'
                    >
                      <Plus className='add-chapter-button__icon' />
                      <span className='add-chapter-button__text'>
                        Add Chapter
                      </span>
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const SectionHeader = ({
  section,
  sectionIndex,
  dragHandleProps,
}: {
  section: Section
  sectionIndex: number
  dragHandleProps: any
}) => {
  const dispatch = useAppDispatch()

  return (
    <div className='droppable-section__header' {...dragHandleProps}>
      <div className='droppable-section__title-wrapper'>
        <div className='droppable-section__title-container'>
          <div className='droppable-section__title'>
            <GripVertical className='mb-1 w-6 h-6' />
            <h3 className='font-medium text-lg'>{section.sectionTitle}</h3>
          </div>
          <div className='droppable-chapter__actions'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='p-0'
              onClick={() => dispatch(openSectionModal({ sectionIndex }))}
            >
              <Edit className='w-5 h-5' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='p-0'
              onClick={() => dispatch(deleteSection(sectionIndex))}
            >
              <Trash2 className='w-5 h-5' />
            </Button>
          </div>
        </div>
        {section.sectionDescription && (
          <p className='droppable-section__description'>
            {section.sectionDescription}
          </p>
        )}
      </div>
    </div>
  )
}

const ChapterItem = ({
  chapter,
  chapterIndex,
  sectionIndex,
  draggableProvider,
}: {
  chapter: Chapter
  chapterIndex: number
  sectionIndex: number
  draggableProvider: any
}) => {
  const dispatch = useAppDispatch()

  return (
    <div
      ref={draggableProvider.innerRef}
      {...draggableProvider.draggableProps}
      {...draggableProvider.dragHandleProps}
      className={`droppable-chapter ${
        chapterIndex % 2 === 1
          ? 'droppable-chapter--odd'
          : 'droppable-chapter--even'
      }`}
    >
      <div className='droppable-chapter__title'>
        <GripVertical className='mb-[2px] w-4 h-4' />
        <p className='text-sm'>{`${chapterIndex + 1}. ${chapter.title}`}</p>
      </div>
      <div className='droppable-chapter__actions'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='droppable-chapter__button'
          onClick={() =>
            dispatch(
              openChapterModal({
                sectionIndex,
                chapterIndex,
              })
            )
          }
        >
          <Edit className='w-4 h-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='droppable-chapter__button'
          onClick={() =>
            dispatch(
              deleteChapter({
                sectionIndex,
                chapterIndex,
              })
            )
          }
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}

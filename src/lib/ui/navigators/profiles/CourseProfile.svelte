<script lang="ts">
  import type { Session } from "@supabase/auth-js/src/lib/types";
  import { popup } from "@skeletonlabs/skeleton";
  import CourseProfileButton from "./CourseProfileButton.svelte";
  import { currentCourse, studentsOnline } from "$lib/stores";
  import CourseProfileMenu from "./CourseProfileMenu.svelte";
  export let session: Session;
  export let handleSignOut: () => void;
  export let handleOnlineStatusChange: () => void;
  export let onlineDrawerOpen: () => void;
</script>

<button use:popup={{ event: "click", target: "avatar" }}>
  <CourseProfileButton {session} usersOnline={$studentsOnline.toString()} />
</button>
<CourseProfileMenu
  {session}
  usersOnline={$studentsOnline.toString()}
  currentCourseId={$currentCourse?.courseId}
  currentCourseUrl={$currentCourse?.courseUrl}
  {handleOnlineStatusChange}
  {handleSignOut}
  {onlineDrawerOpen}
/>

#include <jni.h>
#include <fbjni/fbjni.h>
#include "NitroNotificationOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::notification::registerAllNatives();
  });
}
